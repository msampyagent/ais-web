import sys
import os
from pathlib import Path
from PIL import Image, ImageOps

SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".tif", ".webp"}

MAX_WIDTH_MAP = {
    "logo":    320,
    "logotop": 320,
    "external": 1920,
    "internal": 1200,
}

HERO_RESPONSIVE_WIDTHS = [480, 640, 960]


def get_max_width(stem: str, default: int = 1920) -> int:
    for key, width in MAX_WIDTH_MAP.items():
        if stem.lower().startswith(key):
            return width
    return default


def _resize_to_width(img: Image.Image, target_width: int) -> Image.Image:
    ratio = target_width / img.width
    new_h = int(img.height * ratio)
    return img.resize((target_width, new_h), Image.LANCZOS)


def _collect_images(paths: list[Path]) -> list[Path]:
    """Expand a list of file/dir paths into a flat list of convertible images."""
    images: list[Path] = []
    for p in paths:
        if p.is_dir():
            images.extend(
                f for f in p.rglob("*")
                if f.is_file() and f.suffix.lower() in SUPPORTED_EXTENSIONS
            )
        elif p.is_file():
            if p.suffix.lower() in SUPPORTED_EXTENSIONS:
                images.append(p)
            else:
                print(f"[SKIP] '{p.name}' — unsupported format.", file=sys.stderr)
        else:
            print(f"[WARN] '{p}' does not exist, skipping.", file=sys.stderr)
    return images


def convert_to_webp(inputs: list[str], quality: int = 75, max_width: int | None = None) -> None:
    paths = [Path(i).resolve() for i in inputs]
    images = _collect_images(paths)

    if not images:
        print("No convertible images found.")
        return

    converted = 0
    failed = 0

    for img_path in images:
        webp_path = img_path.with_suffix(".webp")
        try:
            with Image.open(img_path) as img:
                img = img.convert("RGBA") if img.mode in ("RGBA", "P") else img.convert("RGB")
                limit = max_width if max_width else get_max_width(img_path.stem)
                if img.width > limit:
                    img = _resize_to_width(img, limit)
                    print(f"       Resized to {img.width}x{img.height}")
                img.save(webp_path, "WEBP", quality=quality, method=6)
            print(f"[OK]  {img_path}  ->  {webp_path.name}")
            converted += 1
        except Exception as e:
            print(f"[FAIL] {img_path}: {e}", file=sys.stderr)
            failed += 1

    print(f"\nDone: {converted} converted, {failed} failed.")


def generate_responsive_variants(hero_src: str, quality: int = 75) -> None:
    """Generate responsive srcset variants for the hero image.

    Given e.g. external.webp (or external.jpeg), produces:
      external-480.webp   (480px wide)
      external-960.webp   (960px wide)
    in the same directory as the source file.
    """
    src = Path(hero_src).resolve()
    if not src.exists():
        print(f"[FAIL] Hero source '{src}' not found.", file=sys.stderr)
        return

    try:
        with Image.open(src) as img:
            img = img.convert("RGBA") if img.mode in ("RGBA", "P") else img.convert("RGB")
            stem = src.stem.split("-")[0]
            for w in HERO_RESPONSIVE_WIDTHS:
                if img.width < w:
                    print(f"[SKIP] {stem}-{w}.webp — source width ({img.width}px) is smaller than {w}px.")
                    continue
                variant = _resize_to_width(img, w)
                out = src.parent / f"{stem}-{w}.webp"
                variant.save(out, "WEBP", quality=quality, method=6)
                print(f"[OK]  {out.name}  ({w}x{variant.height})")
    except Exception as e:
        print(f"[FAIL] {src}: {e}", file=sys.stderr)


GALLERY_THUMB_WIDTH = 600
GALLERY_FULL_WIDTH = 1920
CROP_ANCHORS = (
    "top-left", "top", "top-right",
    "left", "center", "right",
    "bottom-left", "bottom", "bottom-right",
)


def parse_aspect(value: str) -> tuple[int, int]:
    parts = value.split(":")
    if len(parts) != 2:
        raise ValueError("aspect must use WIDTH:HEIGHT")
    width, height = (int(part) for part in parts)
    if width <= 0 or height <= 0:
        raise ValueError("aspect dimensions must be positive")
    return width, height


def _crop_to_aspect(img: Image.Image, aspect: tuple[int, int], anchor: str) -> Image.Image:
    aspect_width, aspect_height = aspect
    target_ratio = aspect_width / aspect_height
    source_ratio = img.width / img.height

    if source_ratio > target_ratio:
        crop_width = round(img.height * target_ratio)
        if "left" in anchor:
            left = 0
        elif "right" in anchor:
            left = img.width - crop_width
        else:
            left = (img.width - crop_width) // 2
        return img.crop((left, 0, left + crop_width, img.height))

    if source_ratio < target_ratio:
        crop_height = round(img.width / target_ratio)
        if anchor.startswith("top"):
            top = 0
        elif anchor.startswith("bottom"):
            top = img.height - crop_height
        else:
            top = (img.height - crop_height) // 2
        return img.crop((0, top, img.width, top + crop_height))

    return img.copy()


def generate_gallery_pair(
    src_path: str,
    full_out_path: str,
    thumb_out_path: str,
    aspect: tuple[int, int] = (3, 4),
    anchor: str = "center",
    full_width: int = GALLERY_FULL_WIDTH,
    thumb_width: int = GALLERY_THUMB_WIDTH,
    quality: int = 75,
) -> None:
    src = Path(src_path).resolve()
    full_out = Path(full_out_path).resolve()
    thumb_out = Path(thumb_out_path).resolve()

    if not src.is_file():
        raise FileNotFoundError(f"Source '{src}' not found.")
    if src in (full_out, thumb_out):
        raise ValueError("Gallery outputs must not overwrite the source file.")
    if full_out == thumb_out:
        raise ValueError("Full and thumbnail outputs must be different files.")
    if full_out.suffix.lower() != ".webp" or thumb_out.suffix.lower() != ".webp":
        raise ValueError("Gallery outputs must use the .webp extension.")
    if aspect[0] <= 0 or aspect[1] <= 0:
        raise ValueError("Aspect dimensions must be positive.")
    if anchor not in CROP_ANCHORS:
        raise ValueError(f"Unsupported crop anchor '{anchor}'.")
    if full_width <= 0 or thumb_width <= 0:
        raise ValueError("Output widths must be positive.")
    if not 1 <= quality <= 100:
        raise ValueError("Quality must be between 1 and 100.")

    with Image.open(src) as source:
        source = ImageOps.exif_transpose(source)
        source = source.convert("RGBA") if source.mode in ("RGBA", "P") else source.convert("RGB")
        cropped = _crop_to_aspect(source, aspect, anchor)
        full = _resize_to_width(cropped, full_width) if cropped.width > full_width else cropped.copy()
        thumb = _resize_to_width(full, thumb_width) if full.width > thumb_width else full.copy()

    full_out.parent.mkdir(parents=True, exist_ok=True)
    thumb_out.parent.mkdir(parents=True, exist_ok=True)
    full.save(full_out, "WEBP", quality=quality, method=6)
    thumb.save(thumb_out, "WEBP", quality=quality, method=6)
    print(f"[OK]  {full_out.name}  ({full.width}x{full.height})")
    print(f"[OK]  {thumb_out.name}  ({thumb.width}x{thumb.height})")


def generate_single_thumb(src_path: str, out_path: str, width: int = GALLERY_THUMB_WIDTH, quality: int = 75) -> None:
    """Generate a single WebP thumbnail from a source image.

    Resizes the source image to the given width (maintaining aspect ratio)
    and saves it as WebP to the specified output path.

    Args:
        src_path: Path to the source image (any supported format).
        out_path:  Path for the output thumbnail (should end in .webp).
        width:     Target width in pixels (default: 600). Height is scaled
                   proportionally. If the source is already narrower than
                   *width*, the image is saved as-is without upscaling.
        quality:   WebP quality 1-100 (default: 75).

    Example CLI usage:
        python convert_to_webp.py --thumb src.png out-thumb.webp
        python convert_to_webp.py --thumb src.png out-thumb.webp --thumb-width 400 --quality 80
    """
    src = Path(src_path).resolve()
    out = Path(out_path).resolve()

    if not src.exists():
        print(f"[FAIL] Source '{src}' not found.", file=sys.stderr)
        return

    try:
        with Image.open(src) as img:
            img = img.convert("RGBA") if img.mode in ("RGBA", "P") else img.convert("RGB")
            if img.width > width:
                thumb = _resize_to_width(img, width)
            else:
                thumb = img.copy()
            out.parent.mkdir(parents=True, exist_ok=True)
            thumb.save(out, "WEBP", quality=quality, method=6)
        print(f"[OK]  {src.name}  ->  {out.name}  ({thumb.width}x{thumb.height})")
    except Exception as e:
        print(f"[FAIL] {src}: {e}", file=sys.stderr)


def generate_gallery_thumbnails(pics_dir: str, quality: int = 75) -> None:
    """Generate -thumb.webp thumbnails (600px wide) for all gallery images.

    Skips hero/logo images and files already ending in -thumb, -480, -640, -960.
    Output: <name>-thumb.webp alongside the source file.
    """
    skip_prefixes = ("logo", "logotop", "external", "internal", "favicon")
    skip_suffixes = ("-thumb", "-480", "-640", "-960")

    src_dir = Path(pics_dir).resolve()
    if not src_dir.is_dir():
        print(f"[FAIL] '{src_dir}' is not a directory.", file=sys.stderr)
        return

    candidates = [
        f for f in src_dir.iterdir()
        if f.is_file()
        and f.suffix.lower() in SUPPORTED_EXTENSIONS
        and not any(f.stem.lower().startswith(p) for p in skip_prefixes)
        and not any(f.stem.lower().endswith(s) for s in skip_suffixes)
    ]

    if not candidates:
        print("No gallery images found.")
        return

    generated = 0
    for img_path in sorted(candidates):
        out = img_path.parent / f"{img_path.stem}-thumb.webp"
        try:
            with Image.open(img_path) as img:
                img = img.convert("RGBA") if img.mode in ("RGBA", "P") else img.convert("RGB")
                if img.width > GALLERY_THUMB_WIDTH:
                    thumb = _resize_to_width(img, GALLERY_THUMB_WIDTH)
                else:
                    thumb = img.copy()
                thumb.save(out, "WEBP", quality=quality, method=6)
            print(f"[OK]  {out.name}  ({thumb.width}x{thumb.height})")
            generated += 1
        except Exception as e:
            print(f"[FAIL] {img_path}: {e}", file=sys.stderr)

    print(f"\nDone: {generated} thumbnails generated.")


def generate_favicons(logo_src: str) -> None:
    """Generate favicon.ico (multi-size) and favicon-32.png from logo source."""
    src = Path(logo_src).resolve()
    if not src.exists():
        print(f"[FAIL] Logo source '{src}' not found.", file=sys.stderr)
        return

    out_dir = src.parent

    try:
        with Image.open(src) as img:
            img_rgba = img.convert("RGBA")

            favicon_ico = out_dir / "favicon.ico"
            img_rgba.save(
                favicon_ico,
                format="ICO",
                sizes=[(16, 16), (32, 32), (48, 48)],
            )
            print(f"[OK]  {favicon_ico.name}  (16x16, 32x32, 48x48)")

            favicon_32 = out_dir / "favicon-32.png"
            img_rgba.resize((32, 32), Image.LANCZOS).save(favicon_32, "PNG")
            print(f"[OK]  {favicon_32.name}  (32x32)")

    except Exception as e:
        print(f"[FAIL] {src}: {e}", file=sys.stderr)


def rotate_image(image_path: str, degrees: int, quality: int = 75) -> None:
    """Rotate an image by specified degrees and save it in place.
    
    Positive degrees = counter-clockwise, negative = clockwise.
    Common values: -90 (90° clockwise), 90 (90° counter-clockwise), 180 (180°).
    """
    src = Path(image_path).resolve()
    if not src.exists():
        print(f"[FAIL] Image '{src}' not found.", file=sys.stderr)
        return

    try:
        with Image.open(src) as img:
            rotated = img.rotate(degrees, expand=True)
            rotated.save(src, "WEBP", quality=quality, method=6)
            print(f"[OK]  {src.name}  rotated {degrees}°")
            print(f"      New dimensions: {rotated.width}x{rotated.height}")
    except Exception as e:
        print(f"[FAIL] {src}: {e}", file=sys.stderr)


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(
        description="Convert images to WebP with optional resize.",
        epilog="INPUTS can be one or more files and/or directories (minimum 1 required).",
    )
    parser.add_argument(
        "inputs",
        nargs="*",
        metavar="INPUT",
        help="One or more image files or directories to convert",
    )
    parser.add_argument("--quality", type=int, default=75, help="WebP quality 1-100 (default: 75)")
    parser.add_argument("--max-width", type=int, default=None, help="Override max width for all images")
    parser.add_argument(
        "--responsive-hero",
        metavar="HERO_FILE",
        help="Generate responsive srcset variants (480w, 960w) from the given hero image file",
    )
    parser.add_argument(
        "--favicons",
        metavar="LOGO_FILE",
        help="Generate favicon.ico and favicon-32.png from the given logo image file",
    )
    parser.add_argument(
        "--gallery-thumbs",
        metavar="PICS_DIR",
        help="Generate -thumb.webp thumbnails (600px wide) for all gallery images in PICS_DIR",
    )
    parser.add_argument(
        "--thumb",
        nargs=2,
        metavar=("SRC_FILE", "OUT_FILE"),
        help="Generate a single WebP thumbnail from SRC_FILE and save it to OUT_FILE",
    )
    parser.add_argument(
        "--gallery-pair",
        nargs=3,
        metavar=("SRC_FILE", "FULL_OUT", "THUMB_OUT"),
        help="Crop one gallery source and generate full-size and thumbnail WebP outputs",
    )
    parser.add_argument(
        "--aspect",
        type=parse_aspect,
        default=(3, 4),
        metavar="WIDTH:HEIGHT",
        help="Crop aspect ratio for --gallery-pair (default: 3:4)",
    )
    parser.add_argument(
        "--crop-anchor",
        choices=CROP_ANCHORS,
        default="center",
        help="Crop anchor for --gallery-pair (default: center)",
    )
    parser.add_argument(
        "--full-width",
        type=int,
        default=GALLERY_FULL_WIDTH,
        help=f"Maximum full image width for --gallery-pair (default: {GALLERY_FULL_WIDTH})",
    )
    parser.add_argument(
        "--thumb-width",
        type=int,
        default=GALLERY_THUMB_WIDTH,
        help=f"Width in pixels for --thumb and --gallery-pair output (default: {GALLERY_THUMB_WIDTH})",
    )
    parser.add_argument(
        "--rotate",
        nargs=2,
        metavar=("IMAGE_PATH", "DEGREES"),
        help="Rotate an image by specified degrees (negative = clockwise, positive = counter-clockwise)",
    )
    args = parser.parse_args()

    if args.responsive_hero:
        print("\n=== Generating hero responsive variants ===")
        generate_responsive_variants(args.responsive_hero, quality=args.quality)

    if args.favicons:
        print("\n=== Generating favicons ===")
        generate_favicons(args.favicons)

    if args.gallery_thumbs:
        print("\n=== Generating gallery thumbnails ===")
        generate_gallery_thumbnails(args.gallery_thumbs, quality=args.quality)

    if args.thumb:
        print("\n=== Generating single thumbnail ===")
        generate_single_thumb(args.thumb[0], args.thumb[1], width=args.thumb_width, quality=args.quality)

    if args.gallery_pair:
        print("\n=== Generating gallery image pair ===")
        try:
            generate_gallery_pair(
                args.gallery_pair[0],
                args.gallery_pair[1],
                args.gallery_pair[2],
                aspect=args.aspect,
                anchor=args.crop_anchor,
                full_width=args.full_width,
                thumb_width=args.thumb_width,
                quality=args.quality,
            )
        except Exception as e:
            print(f"[FAIL] {e}", file=sys.stderr)
            sys.exit(1)

    if args.rotate:
        print("\n=== Rotating image ===")
        image_path, degrees_str = args.rotate
        try:
            degrees = int(degrees_str)
            rotate_image(image_path, degrees, quality=args.quality)
        except ValueError:
            print(f"[FAIL] Degrees must be an integer, got '{degrees_str}'", file=sys.stderr)

    if args.inputs:
        print("\n=== Converting images to WebP ===")
        convert_to_webp(args.inputs, quality=args.quality, max_width=args.max_width)
    elif not args.responsive_hero and not args.favicons and not args.gallery_thumbs and not args.thumb and not args.gallery_pair:
        parser.print_help()
