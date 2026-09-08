# Review rules — italianiasiviglia.com

Rules for reviewing a diff in this repository. Every rule below is checkable against changed lines alone. Flag a violation with the file, the line and the rule number.

Full context lives in `CLAUDE.md`; the binding sources are `1streview/*.dc.html` (visual) and `ais-brief/data/*.json` (content and routes).

## 1. Design system

1.1 **No opacity on blocks containing body text.** `opacity` on a container with running text is a defect. De-emphasise with `--grigio` ink or a `#F1EBE3` card fill. Opacity is allowed only on purely decorative elements (the Giralda watermark).

1.2 **Every tricolore bar carries its hairline.** A 96×3px tricolore element without `box-shadow: 0 0 0 .5px rgba(121,52,33,.28)` is a defect — the white segment disappears on cream.

1.3 **No raw hex in component or page CSS.** Colours come from the custom properties in `assets/css/tokens.css`. A new hex value means either a missing token or an invented colour; both need flagging.

1.4 **Decorative colours never carry text.** `--verde-vivo` (#35972B), `--verde-illu` (#019E48) and `--corallo` (#F84446) must not appear as a `color` value on text. `--verde` (#1E7A3C) and `--rosso` (#C81E20) are the text-safe pair.

1.5 **Two background colours per page maximum.** Sections alternate `--crema` and `--avorio`. `--indaco` is reserved for strong blocks (Feria, footer).

1.6 No emoji in markup, no gradients beyond what the artboards show, no icons outside the 24×24 stroke-1.5 set.

## 2. Accessibility (WCAG 2.1 AA)

2.1 **Focus is never removed.** `outline: none` or `outline: 0` without an equivalent visible replacement is a defect. The standard is `outline: 2px solid var(--indaco); outline-offset: 2px`.

2.2 **Interactive targets ≥ 44px** on mobile; inputs ≥ 48px tall.

2.3 **Every input has a visible, persistent `<label>`** associated by `for`/`id`. A placeholder is not a label.

2.4 **Form errors carry an icon plus text**, never colour alone, and are linked with `aria-describedby`.

2.5 **`aria-expanded` on every disclosure** — dropdown, accordion, mobile menu — kept in sync in JS, and operable by keyboard.

2.6 **One `<h1>` per page, no skipped heading levels.**

2.7 **Content images have descriptive `alt`; decorative images have `alt=""`.** A missing `alt` attribute is a defect.

2.8 `prefers-reduced-motion` is honoured wherever a transition or animation is introduced.

## 3. Bilingual and SEO

3.1 **hreflang is reciprocal.** A page that declares an alternate must be declared back by that alternate. `x-default` points at the ES URL.

3.2 **Self-referential `<link rel="canonical">` on every page.**

3.3 **`<html lang>` matches the tree** (`es` under `/es/`, `it` under `/it/`), and any inline passage in the other language carries its own `lang`.

3.4 **`<title>` and `<meta name="description">` are unique per page and written in that page's language.** No template placeholders shipped.

3.5 **Routes come from `nav.json` and `forms.json`.** A URL that contradicts them is a defect, regardless of what any prose document says.

3.6 **Images declare `width` and `height`**, use `loading="lazy"` below the fold and `decoding="async"`.

## 4. Content integrity

4.1 **`TODO_` values stay `TODO_`.** Never substitute a real-looking name, fee, CIF or registry number for a placeholder. Inventing board members is the most serious defect in this repo.

4.2 **Microcopy from the artboards and JSON is copied verbatim.** Rewording approved Spanish or Italian copy is a defect. New copy is allowed only where the artboards cover nothing, and must be flagged as unvalidated.

4.3 **Both locales move together.** A content JSON entry that gains an `es` value without its `it` twin (or vice versa) is incomplete.

4.4 JSON data files must stay valid against `ais-brief/data/schemas/*.json`.

## 5. Stack constraints

5.1 **No framework, no bundler, no runtime npm dependency.** The site must work opened from the filesystem. A `<script src>` pointing at a CDN is a defect.

5.2 **`build/build.mjs` stays dependency-free** — Node standard library only.

5.3 **Progressive enhancement.** Filters, accordions, the mobile menu and the language switcher must degrade to something usable with JavaScript disabled; forms must remain submittable.

5.4 **No blocking JavaScript.** Scripts are `defer` or `type="module"`.

5.5 **No tracker or third-party request fires before cookie consent.**

## 6. Out of scope for review

`1streview/` is a read-only design export and is excluded in `.gga`. If a diff modifies it, that alone is the finding.
