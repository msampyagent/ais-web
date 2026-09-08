# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

A **pre-implementation** repo for rebuilding `italianiasiviglia.com`, the site of the Asociación Italiani a Siviglia (founded 14 Feb 2010). There is no source code yet: git has **zero commits**, there is no `package.json`, no toolchain, no site directory.

What exists is the full upstream chain that the build must consume: an audit of the old site, an information architecture, a design brief, eleven approved design artboards, and structured content JSON. The next task is turning that into a real static site.

## Commands

There is no build, lint, or test command yet — nothing to run until `build/build.mjs` exists.

```bash
open "1streview/AIS Index.dc.html"   # artboard index; every artboard links from here
open "1streview/AIS Style Tile.dc.html"
```

Artboards are standalone HTML with everything inline — reading the source is usually faster and more precise than opening them.

When the generator is written, `PROMPT-claude-code.md` specifies it as **plain Node, zero runtime dependencies**: `node build/build.mjs`, reading `data/*.json` and emitting committed HTML.

## Source-of-truth hierarchy

Conflicts between documents are common here. Resolve them in this order:

1. **`1streview/*.dc.html`** — absolute authority for colour, type, spacing, components, states and microcopy. Nothing visual gets invented.
2. **`ais-brief/data/*.json`** — authority for content, and for **routes**. `nav.json` and `forms.json` override any URL list written in prose.
3. **`PROMPT-claude-code.md`** — the operative build order: stack, scope, SEO/a11y requirements, acceptance criteria, and the five-stream agent split.
4. **`01-audit.md` / `02-information-architecture.md`** — the reasoning behind the decisions. Read for *why*, not for current values.

### Known conflicts already resolved

- **Routes.** `PROMPT-claude-code.md` lists `/es/la-asociacion/` and `/es/guia-practica/`. `nav.json` says `asociacion/` and `guia-italianos-sevilla/`. **`nav.json` wins** — the prompt says so itself.
- **Stack.** `ais-brief/00-README.md` proposes Astro on Cloudflare Pages with a Pages Function for the form. `PROMPT-claude-code.md` supersedes it: **static HTML + vanilla CSS/JS, no framework, no bundler, no runtime npm dependency**, must work opened from the filesystem. A Node build script that expands JSON into committed HTML is fine and encouraged.
- **`schemas.json` does not exist.** `PROMPT-claude-code.md` tells you to base the JSON-LD on it. What exists is `ais-brief/data/schemas/*.json` — five **JSON Schema draft 2020-12** files that validate content shape (`event`, `career`, `team-member`, `convenio`, `news`), not schema.org templates. They do map 1:1 onto their schema.org counterparts, so use them as the field map, but the JSON-LD blocks have to be authored. Per-route structured-data targets are in `02-information-architecture.md`.

## Duplicated files — keep in sync or delete

These are byte-identical copies, not variants:

- `01-audit.md`, `02-information-architecture.md`, `03-PROMPT-claude-design.md` ≡ the same files under `ais-brief/`
- `ais-brief/data/` ≡ `1streview/brief/data/`
- `ais` (a `.zip` with no extension) and `Completing AIS design credits.zip` are two exports of the same design canvas; `1streview/` is the extracted later one

Edit `ais-brief/` as canonical. Never edit one copy of a pair alone.

## Reading the artboards

`.dc.html` files come from a canvas design tool. Filter out the scaffolding:

- `<x-dc>`, `<helmet>`, `<image-slot>` tags, `support.js`, `image-slot.js`, `.thumbnail`, `uploads/` — tooling, **not** part of the site
- Everything is **inline-styled**, no stylesheet. Every design value is readable directly on the element it applies to
- Artboards pair desktop 1440 and mobile 390, and alternate ES/IT to prove both locales

## Design system — non-negotiables

Extract tokens from `AIS Style Tile.dc.html` and `AIS Componentes.dc.html` before writing CSS. These constraints were verified during design and are easy to break by accident:

1. **Never reduce opacity on a block containing body text.** De-emphasise with ink colour (`--grigio`) or card fill (`#F1EBE3`).
2. The **96×3px tricolore bar** always carries `box-shadow: 0 0 0 .5px rgba(121,52,33,.28)` — without it the white segment vanishes on cream.
3. Text contrast **≥ 4.5:1** (3:1 only for display scale). `--verde-vivo`, `--verde-illu` and `--corallo` are decorative only, never text.
4. Touch targets ≥ 44px; inputs ≥ 48px with an always-visible label above the field.
5. Form errors use **colour *and* icon**, never colour alone.
6. Focus is always visible: `outline: 2px solid var(--indaco); outline-offset: 2px`.
7. Max two background colours per page — sections alternate `--crema`/`--avorio`; `--indaco` is for strong blocks (Feria, footer).
8. No emoji, no aggressive gradients, no invented icons (stroke 1.5, 24×24).

Fonts: Fraunces (display, `SOFT 40 WONK 1`), Inter (UI/body), Caveat Brush (stickers).

## Content and language rules

The site is bilingual with **Spanish as default**, symmetric `/es/` and `/it/` trees, root redirecting to `/es/`. Every page has a reciprocal twin — hreflang must be reciprocal both ways with `x-default` on ES.

- **Microcopy is approved and copied verbatim** from artboards and JSON. Do not rewrite, retranslate or "improve" it.
- Content the artboards don't cover (three of the four guide articles, legal pages) must be written new, in the same dry concrete tone, and **flagged in the report as unvalidated**.
- Every JSON file is annotated `ai-generated` and carries a `_comment` explaining provenance and what still needs human verification. Read it before trusting a record.
- `TODO_` values (board names in `team.json`, CIF, registry number, membership fee, Feria 2026 dates) **stay placeholders**. Never invent people or figures.
- Repo docs are mixed-language by design: audit and IA in English, `PROMPT-claude-code.md` in Italian, site content in ES/IT. New technical artifacts default to English.

## Known gaps

- **`sevilla-italia.png`** (hero skyline illustration) does not exist. Artboards use a placeholder; the site should ship a `--avorio` `<div>` with a commented-out `<img>` ready to swap, and the gap reported.
- **Six client questions in `PROMPT-claude-code.md` are unanswered**: deploy target and base path, form endpoint, membership fee and payment link, Eventbrite per-event links, whether the 2009–2024 blogspot is linked or migrated, and newsletter provider. Ask before building anything that depends on them.
- `.gga` (Gentleman Guardian Angel) is configured for a TypeScript project — `FILE_PATTERNS="*.ts,*.tsx,*.js,*.jsx"` and `RULES_FILE="AGENTS.md"`, which doesn't exist. Update it when the real stack lands.

## SEO is a first-class deliverable

The client asked for it explicitly, and `02-information-architecture.md` maps it per route. Non-optional: unique in-language title and description per page, self-referential canonical, fully reciprocal hreflang, hand-authored JSON-LD (`Organization` everywhere, `Event`, `BreadcrumbList`, `FAQPage`, `Article`, `LocalBusiness` where data supports it), Open Graph with `og:locale:alternate`, `sitemap.xml` with `xhtml:link` alternates, one `<h1>` per page, explicit image dimensions. Targets: Lighthouse ≥ 95 across all four categories, CLS < 0.05, WCAG 2.1 AA, and the site must remain readable and submittable with JavaScript disabled.
