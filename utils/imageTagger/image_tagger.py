import argparse
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

SUPPORTED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp", ".tiff", ".tif"}

CANDIDATE_FONTS = [
    "/System/Library/Fonts/Supplemental/Arial.ttf",
    "/System/Library/Fonts/Helvetica.ttc",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "C:/Windows/Fonts/arial.ttf",
]


def _load_font(size: int) -> ImageFont.FreeTypeFont:
    for path in CANDIDATE_FONTS:
        if Path(path).is_file():
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                continue
    try:
        return ImageFont.load_default(size=size)
    except TypeError:
        return ImageFont.load_default()


def _collect_images(root: Path) -> list[Path]:
    images: list[Path] = []
    for f in root.rglob("*"):
        if not f.is_file() or f.suffix.lower() not in SUPPORTED_EXTENSIONS:
            continue
        images.append(f)
    return images


def _text_size(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont) -> tuple[int, int]:
    bbox = draw.textbbox((0, 0), text, font=font)
    return bbox[2] - bbox[0], bbox[3] - bbox[1]


def _tag_image(img: Image.Image, tag: str, margin: int, font_size: int | None, opacity: int) -> Image.Image:
    base = img.convert("RGBA")
    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    size = font_size or max(10, int(min(base.width, base.height) * 0.025))
    font = _load_font(size)

    text_w, text_h = _text_size(draw, tag, font)
    fill = (255, 255, 255, opacity)

    positions = {
        "top-left": (margin, margin),
        "top-right": (base.width - text_w - margin, margin),
        "bottom-left": (margin, base.height - text_h - margin),
        "bottom-right": (base.width - text_w - margin, base.height - text_h - margin),
    }

    for xy in positions.values():
        draw.text(xy, tag, font=font, fill=fill)

    tagged = Image.alpha_composite(base, overlay)
    return tagged


def _save(tagged: Image.Image, src_ext: str, out_path: Path) -> None:
    ext = src_ext.lower()
    if ext in (".jpg", ".jpeg", ".bmp"):
        tagged.convert("RGB").save(out_path, quality=90)
    elif ext == ".webp":
        tagged.save(out_path, "WEBP", quality=90, method=6)
    else:
        tagged.save(out_path)


def tag_folder(input_folder: str, tag: str, font_size: int | None, margin: int, opacity: int) -> None:
    root = Path(input_folder).resolve()
    if not root.is_dir():
        print(f"[FAIL] '{root}' is not a valid directory.", file=sys.stderr)
        sys.exit(1)

    out_root = root.parent / f"{root.name}_{tag}"

    images = _collect_images(root)
    if not images:
        print("No images found to tag.")
        return

    tagged_count = 0
    failed = 0

    for img_path in images:
        rel = img_path.relative_to(root)
        out_path = out_root / rel
        try:
            with Image.open(img_path) as img:
                tagged = _tag_image(img, tag, margin, font_size, opacity)
                out_path.parent.mkdir(parents=True, exist_ok=True)
                _save(tagged, img_path.suffix, out_path)
            print(f"[OK]  {rel}  ->  {out_root.name}/{rel}")
            tagged_count += 1
        except Exception as e:
            print(f"[FAIL] {rel}: {e}", file=sys.stderr)
            failed += 1

    print(f"\nDone: {tagged_count} tagged, {failed} failed.")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Stamp a small text tag (e.g. EN, ES) into the 4 corners of every image in a folder."
    )
    parser.add_argument("--input-folder", required=True, help="Root folder to scan recursively.")
    parser.add_argument("--tag", required=True, help="Short text to stamp, e.g. EN, ES.")
    parser.add_argument("--font-size", type=int, default=None, help="Override auto font size (px).")
    parser.add_argument("--margin", type=int, default=8, help="Margin from each corner in px (default: 8).")
    parser.add_argument("--opacity", type=int, default=255, help="Text opacity 0-255 (default: 255).")
    args = parser.parse_args()

    tag_folder(args.input_folder, args.tag, args.font_size, args.margin, args.opacity)


if __name__ == "__main__":
    main()
