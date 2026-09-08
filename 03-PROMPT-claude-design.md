# PROMPT FOR CLAUDE DESIGN — copy everything below the line

---

## PROJECT

Design the complete visual system and page set for **italianiasiviglia.com**, the website of the **Asociación Italiani a Siviglia (AIS)** — the association of Italians living in Seville, Spain, founded 14 February 2010.

The current site is an untouched WordPress default with one placeholder page. This is a **greenfield rebuild**, not a refresh. Do not carry over anything from the existing layout.

Output: a **multi-artboard canvas**. Desktop artboards at **1440×auto**, mobile artboards at **390×auto**. Every page must be shown at both widths unless I say desktop-only.

---

## 1. WHO THIS IS FOR

Three audiences, in priority order:

1. **Italians already living in Seville or about to move there** (~25–55, families and young professionals). They want: what's on this month, how do I sort out AIRE/consulate paperwork, where do I buy real Italian food, who else is here. They read Italian, they function in Spanish.
2. **Local Seville businesses and sponsors.** They want to know the association is real, established and worth attaching a brand to.
3. **Institutions** — Ayuntamiento de Sevilla, Consolato Generale d'Italia, Com.It.Es. They already co-organise the Feria de Italia. The site must not embarrass them.

Tone: **warm, concrete, un-bureaucratic.** This is a community of friends that happens to be a registered association, not a government office. Never corporate, never touristy-kitsch. No pizza clichés, no waving flags, no Vespa illustrations.

---

## 2. BRAND FOUNDATION — use these exact values

The palette is **derived from the association's own assets**: their logo, their Seville-skyline illustration, and the cream-and-brown poster template they already use on Instagram. Do not invent a new palette. This continuity is deliberate — the site should feel like the same hand that makes their posters.

### Colour tokens

```css
:root {
  /* Grounds */
  --crema:      #F9F9ED;  /* page ground — taken from their Instagram poster background */
  --avorio:     #FEEED6;  /* warm surface, alternating sections */
  --sabbia:     #FEC191;  /* accent surface, callouts, hover fills */
  --bianco:     #FFFFFF;  /* cards on crema */

  /* Ink & brand */
  --siena:      #793421;  /* PRIMARY. Their own poster headline colour. Buttons, links, H1 */
  --indaco:     #342B5D;  /* SECONDARY. From the skyline illustration outlines. Institutional sections, footer */
  --inchiostro: #1C1917;  /* body text */
  --grigio:     #5C544C;  /* secondary text, captions */

  /* Tricolore — text-safe versions */
  --verde:      #1E7A3C;
  --rosso:      #C81E20;

  /* Tricolore — DECORATIVE ONLY, never text, never small UI */
  --verde-vivo: #35972B;  /* the logo green */
  --verde-illu: #019E48;  /* the illustration green */
  --corallo:    #F84446;  /* the illustration red */

  /* Lines */
  --linea:      rgba(121, 52, 33, 0.14);
  --linea-forte:rgba(121, 52, 33, 0.28);
}
```

**Contrast rules — these are verified, respect them exactly:**

| Foreground | On `--crema` | Verdict |
|---|---|---|
| `--siena` #793421 | 8.51 : 1 | AAA — safe at any size |
| `--indaco` #342B5D | 12.00 : 1 | AAA |
| `--inchiostro` #1C1917 | 16.49 : 1 | AAA |
| `--grigio` #5C544C | 7.00 : 1 | AAA |
| `--verde` #1E7A3C | 5.07 : 1 | AA — body text OK |
| `--rosso` #C81E20 | 5.41 : 1 | AA — body text OK |
| `--verde-vivo` #35972B | 3.53 : 1 | **Large text / borders only** |
| `--corallo` #F84446 | 3.35 : 1 | **Decorative only** |

White text is safe on `--siena` (9.03), `--indaco` (12.73), `--verde` (5.38), `--rosso` (5.73).
White text **fails** on `--corallo` and `--verde-vivo` — never put label text on those fills.

### Typography

- **Display / headings:** **Fraunces** (Google Fonts, variable). Weights 400 and 600. Set `opsz` to match size, `SOFT 40`, `WONK 1`. This face carries the warmth; use it for H1–H3 and for pull quotes.
- **Body / UI:** **Inter** (Google Fonts, variable). 400, 500, 600.
- **Accent / stickers only:** **Caveat Brush**. Used **at most twice per page**, on rotated badge chips ("Gratis", "Solo socios", "Nuevo"). Never for real content, never for navigation.

Type scale (desktop → mobile):

| Token | Desktop | Mobile | Face / weight |
|---|---|---|---|
| `display` | 72 / 1.02 | 40 / 1.06 | Fraunces 600 |
| `h1` | 52 / 1.08 | 34 / 1.12 | Fraunces 600 |
| `h2` | 38 / 1.15 | 28 / 1.18 | Fraunces 600 |
| `h3` | 26 / 1.25 | 22 / 1.28 | Fraunces 400 |
| `h4` | 20 / 1.35 | 18 / 1.38 | Inter 600 |
| `lead` | 21 / 1.6 | 18 / 1.6 | Inter 400 |
| `body` | 17 / 1.65 | 16 / 1.65 | Inter 400 |
| `small` | 15 / 1.55 | 14 / 1.55 | Inter 400 |
| `label` | 13 / 1.3, +0.08em, uppercase | 12 | Inter 600 |

Prose line length: **max 68 characters.** Never let a paragraph run the full 1240px container.

### Spacing, containers, shape

- 4px base. Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160.
- Container: `1240px` max, `72px` desktop gutter, `20px` mobile gutter. Prose container `720px`.
- Section vertical padding: desktop `96–128px`, mobile `56–72px`.
- Radii: `0` (rules, bands), `8px` (inputs, chips), `16px` (cards), `28px` (feature panels), `999px` (pills, avatars).
- Shadows are **warm-tinted, never black**:
  - `--sh-1: 0 1px 2px rgba(121,52,33,.06), 0 2px 8px rgba(121,52,33,.05)`
  - `--sh-2: 0 4px 12px rgba(121,52,33,.08), 0 12px 32px rgba(121,52,33,.07)`
- Borders: `1px solid var(--linea)` as the default card edge. Cards should read as *drawn*, not floating.

### Motion

150–220 ms, `cubic-bezier(.2,.8,.2,1)`. Hover: card lifts 2px and its border goes to `--linea-forte`. Focus ring: `2px solid var(--indaco)` with `2px` offset, always visible, never removed. Honour `prefers-reduced-motion`.

---

## 3. FIVE SIGNATURE DEVICES — use these to make it look like AIS and nothing else

1. **The tricolore rule.** A 3px horizontal bar split green / ivory / red, 96px wide, sitting above section headings and under the logo. It is the *only* place the flag appears. Restraint is the point.
2. **The Giralda silhouette.** Lift the tower outline from the association's logo. Use it (a) as a 480px, 4%-opacity `--siena` watermark bleeding off the right edge of the hero and the footer, and (b) as a 12px marker replacing bullet dots in short lists.
3. **Poster-first event cards.** The association already produces beautiful 4:5 Canva posters for every event. The card design must make the poster the hero — full-bleed 4:5 image at the top, metadata below. Never crop a poster into a 16:9 thumbnail.
4. **Sticker badges.** Small rotated (−2°) rounded chips in Caveat Brush over a `--sabbia` or `--avorio` fill: *Gratis · Entrada libre · Solo socios · Nuevo · In italiano*. Max two per view.
5. **Hand-drawn sparkles.** Four-point sparkle doodles in `--siena` at 30% opacity, the same ones on their Instagram posters. Two or three per page maximum, in the corners of feature panels. If in doubt, leave them out.

**Never use:** stock "diverse team high-fiving" photography, gradient meshes, glassmorphism, neon, dark mode as the default, generic Material/Bootstrap components, emoji as icons.

**Icons:** Lucide, 1.5px stroke, `--siena` or `--indaco`, 20px inline / 24px standalone.

---

## 4. LANGUAGE — the site is fully bilingual, two separate URL trees

Every page exists at `/es/…` and `/it/…`. **Design both.** Where I give copy below, both versions are provided — use the Spanish string on Spanish artboards, the Italian string on Italian ones. Italian and Spanish run 15–20% longer than English: **no button, chip or nav item may be designed to fit only one language.** Test the longest string.

The **language switcher** sits in the top-right utility rail: `ES · IT` with the active one in `--siena` 600 and the other in `--grigio`. On mobile it is the first row inside the menu sheet, full width, as a two-button segmented control. It must never be a globe icon with a hidden dropdown.

Show the switcher state on at least one desktop and one mobile artboard.

---

## 5. COMPONENTS TO DESIGN

Build these as a component sheet artboard, then use them consistently:

- **Buttons:** primary (`--siena` fill, white text), secondary (`--siena` outline), ghost, and a small pill. Each in default / hover / focus / disabled.
- **Nav bar:** 72px tall, `--crema` with a `--linea` bottom border; sticky, and on scroll it compresses to 60px and gains `--sh-1`. Logo left, 6 nav items centre-left, utility rail right, "Hazte socio / Associati" as a filled button.
- **Dropdown panel** for La Asociación / Eventos / Guía práctica: a wide panel, not a thin list — two columns, each item with a label and one line of description.
- **Mobile menu:** full-screen sheet, `--crema`, language segmented control at the top, accordion sections, the join CTA pinned at the bottom as a full-width button.
- **Event card:** 4:5 poster, date chip overlaid top-left (`--bianco`, day number in Fraunces 600 over the month in `label`), title, venue line with pin icon, language chip (IT / ES / IT+ES), price or "Gratis" sticker.
- **Convenio card:** partner logo on `--bianco` at the top (contain, never crop, letterboxed on white), category chip, name, two-line description, and the discount as a **large `--rosso` figure** — the number is the hero, e.g. "20%".
- **Role card** (colabora): title, type badge (Voluntariado / Junta / Prácticas / Remunerado, each its own colour), **commitment line — the most important field, give it visual weight**, languages, "Ver más".
- **Team card:** square portrait or, when there is no photo, an initials monogram in `--sabbia` with `--siena` letters. Never a grey silhouette.
- **Form fields:** text, email, select, textarea, file drop, checkbox. 48px minimum height. Labels above the field, always visible — no placeholder-as-label. Errors in `--rosso` below the field with an icon, never colour alone.
- **Stat / trust strip:** "Desde 2010 · +200 eventos · IX Feria de Italia · 5 convenios activos" — figures in Fraunces `h2`, labels in `label`.
- **Institutional logo row:** greyscale at 60% opacity, colour on hover.
- **Breadcrumbs, pagination, filter chips, empty states, cookie banner** (decline-by-default, two equal-weight buttons — never a dark-pattern dim on "reject").

---

## 6. PAGES TO DESIGN — in this order

### A. Style tile (1 artboard, 1440)
Colour swatches with hex and contrast ratios, the type scale specimen set in Spanish and Italian (so accented characters are visible), buttons, chips, the tricolore rule, the Giralda watermark, sparkle doodles, shadow samples.

### B. Homepage — desktop + mobile

Sections, in order:

1. **Hero.** Left: `label` "Sevilla · Desde 2010" / "Siviglia · Dal 2010"; H1 *"La comunidad italiana de Sevilla"* / *"La comunità italiana di Siviglia"*; lead *"Encuentros, cultura, gastronomía y ayuda práctica para quien vive el italiano en Sevilla."* / *"Incontri, cultura, gastronomia e aiuto pratico per chi vive l'italiano a Siviglia."*; two buttons: **Hazte socio / Associati** (primary) and **Ver eventos / Vedi eventi** (secondary). Right: the existing Seville-skyline illustration (`sevilla-italia.png` — Giralda, cathedral and Plaza de España over green/white/red bands), full-bleed to the right edge, with the Giralda watermark behind it. Below the fold line: the institutional logo row.
2. **Próximos eventos / Prossimi eventi.** Three event cards, "Ver todo el calendario" link on the right of the section heading.
3. **Ventajas para socios / Convenzioni.** The strongest conversion block. Section heading + one line, then four convenio cards with the discount figures large. Two CTAs: *"Ver todas las ventajas"* and, quieter, *"¿Tienes un negocio? Hazte partner"* / *"Hai un'attività? Diventa partner"*.
4. **La Feria de Italia.** Full-bleed `--indaco` band, white text, the IX Feria poster at 4:5 on the left, on the right: the story, the "X edición" line, the Ayuntamiento + Consulate + Com.It.Es. endorsement, and a CTA. This is the single most impressive thing the association does — give it the most visual weight on the page.
5. **Qué hacemos / Cosa facciamo.** Six items in a 3×2 grid with Lucide icons and one line each: Eventos y encuentros · AIS Bambini · Encuentros literarios · Excursiones · Cursos de cocina · Cineforum.
6. **Guía práctica.** `--avorio` band. Heading *"¿Acabas de llegar a Sevilla?"* / *"Sei appena arrivato a Siviglia?"*, four link cards: AIRE y consulado · Com.It.Es. y voto · Llegar a Sevilla · Dónde comprar italiano.
7. **Únete / Unisciti.** `--sabbia` panel, radius 28. Heading *"Perché associarsi"* / *"Por qué hacerte socio"* with the four real benefits: *Acceso a encuentros y eventos · Comunidad y momentos de convivencia · Descuentos en actividades organizadas · Red y apoyo comunitario*. Primary CTA.
8. **Instagram strip.** Six recent posts, 1:1, with the handle `@associazioneitalianiasiviglia`.
9. **Footer.** `--indaco`, four columns exactly as specified in §7 below, institutional logo row, social icons, Giralda watermark bottom-right at 4% white.

### C. Events index — desktop + mobile
Filter rail: series (Feria de Italia, AIS Bambini, Incontri letterari, Escursioni, Cineforum, Cucina, Aperitivi), language, "Solo próximos / Solo prossimi" toggle. Card grid 3-up desktop / 1-up mobile. Past events in a visually quieter section below, at 70% opacity with a "Archivo" heading.

### D. Event detail — desktop
Poster left (sticky on scroll), content right: title, date/time/venue block, language chip, price, registration CTA, description, programme timeline (design it for the IX Feria's 13-slot two-day programme — that is the stress test), organisers and sponsors, "Añadir al calendario" link, share row.

### E. Convenios / Ventajas socios — desktop + mobile
Intro block explaining the scheme. Category filter chips. Card grid 3-up. **At the bottom, a full-width `--sabbia` panel: "¿Tienes un negocio en Sevilla?" / "Hai un'attività a Siviglia?"** with the partner-recruitment pitch and a CTA to the form below.

### F. **Hazte partner / Diventa partner form — desktop + mobile** *(design this carefully, it is a priority)*

Two-column desktop: left = the pitch, right = the form card on `--bianco` with `--sh-2`.

Left column copy:
> **ES** — "¿Te gustaría ofrecer descuentos exclusivos a los socios de AIS y dar a conocer tu negocio a la comunidad italiana de Sevilla?"
> **IT** — "Ti piacerebbe offrire sconti esclusivi ai soci AIS e far conoscere la tua attività alla comunità italiana di Siviglia?"

Plus three reassurance points: *Gratis · Sin permanencia · Te respondemos en pocos días*.

The form is **progressive by design — this is the "one click" requirement**:

- **Step 1, always visible, 5 required fields only:** Nombre del negocio · Persona de contacto · Email · Categoría (select) · Descuento o ventaja para socios.
- **Then one disclosure row**, open on desktop, collapsed on mobile: *"Añadir logo, mapa y redes (opcional)"* / *"Aggiungi logo, mappa e social (facoltativo)"* — containing Teléfono, Dirección, **enlace de Google Maps**, Sitio web, Instagram, Facebook, descripción de dos líneas, and a **logo drag-and-drop zone** (PNG/JPG/SVG/WebP, max 5 MB, with a thumbnail preview state).
- Privacy consent checkbox with an inline link.
- Submit button full width: **"Enviar propuesta" / "Invia proposta"**.
- Design **three states**: empty, filled-with-logo-preview, and success. Success = the form card swaps to a `--verde` check mark, *"Recibido. Te escribimos en los próximos días."*, and a secondary link back to the convenios list.
- Never disable the submit button while the optional block is empty.

### G. Equipo / Direttivo — desktop
Board grid (6 members), each with role, name, one-line bio. Mix real photos and initials monograms so both states are visible. Below: a "Cómo se elige la junta" note linking to the statutes, and a volunteer recruitment strip linking to Colabora.

### H. Colabora / Collabora (careers) — desktop
Intro: *"La asociación se mueve gracias a voluntarios."* Filter by area. Role cards with the commitment line prominent. **Design the empty state too** — when no role is open: *"Ahora mismo no hay vacantes abiertas, pero siempre hay algo que hacer. Escríbenos."*

### I. Guía práctica article — desktop
Long-form template: breadcrumbs, H1, lead, reading time, sticky table of contents on the left, 720px prose column, callout boxes in `--avorio` for official links, an FAQ accordion, and a "¿Te ayudamos? Hazte socio" card at the end.

### J. Header, footer and mobile menu — as a dedicated artboard
Full detail at 1440 and 390, including the dropdown panel open and the mobile sheet open.

---

## 7. NAVIGATION — exact structure

**Top bar, 6 items:**

| | ES | IT |
|---|---|---|
| 1 | La Asociación ▾ | L'Associazione ▾ |
| 2 | Eventos ▾ | Eventi ▾ |
| 3 | Ventajas socios | Convenzioni |
| 4 | Guía práctica ▾ | Guida pratica ▾ |
| 5 | Noticias | Notizie |
| 6 | **Hazte socio** (button) | **Associati** (button) |

Dropdowns:
- *La Asociación*: Quiénes somos · Equipo · Historia · Estatutos y transparencia
- *Eventos*: Calendario · Feria de Italia · AIS Bambini · Encuentros literarios · Eventos pasados
- *Guía práctica*: AIRE y consulado · Com.It.Es. y voto · Llegar a Sevilla · Dónde comprar productos italianos

**Footer, 4 columns:**

| La Asociación | Participa | Recursos | Legal y contacto |
|---|---|---|---|
| Quiénes somos | Hazte socio | Guía práctica | Contacto |
| Equipo | Ventajas socios | Preguntas frecuentes | Política de privacidad |
| Historia | **Hazte partner** | Directorio italiano | Política de cookies |
| Estatutos y transparencia | Voluntariado | Galería | Aviso legal |
| Prensa | Patrocinar la Feria | Archivo 2009–2024 ↗ | Accesibilidad |
| Colabora con nosotros | Newsletter | | |

Italian column heads: L'Associazione · Partecipa · Risorse · Legale e contatti.

Footer bottom bar: institutional logos (Ayuntamiento de Sevilla, Consolato Generale d'Italia, Com.It.Es.), social icons (Instagram, Facebook), `© 2026 Asociación Italiani a Siviglia · Sevilla, España`, email `info@italianiasiviglia.com`.

---

## 8. REAL CONTENT TO USE — do not invent placeholder text

**Membership benefits** (the association's own wording):
- IT: Accesso ad incontri ed eventi · Comunità, momenti di convivialità · Sconti in attività organizzate · Rete e supporto comunitario
- ES: Acceso a encuentros y eventos · Comunidad y momentos de convivencia · Descuentos en actividades organizadas · Red y apoyo comunitario

**Five real convenios** for the cards:

| Partner | Category | Benefit | Address |
|---|---|---|---|
| Piaceri Italiani | Alimentación | 8% en todos los productos | C. Regina, 23, Sevilla |
| La Cocinera Tremenda | Restauración | 1 plato de pasta gratis por cada 30 € | Mercado del Arenal, Puesto 13, C/ Pastor y Landero |
| Tomares Dental | Salud | 10% en todos los servicios | Av. de la Arboleda 56–58, Tomares |
| Lazzo — When Pizza Meets Burger | Restauración | 20% en toda la carta | Av. de Llanes 8, Sevilla |
| MYES — My English School | Formación | 10% cursos · 50% matrícula · 3 clases gratis | Av. República Argentina 16, Sevilla |

**Real events** for the cards: *IX Feria de Italia* (Colegio Marista, C/ Paraíso 8, 26–27 October, entrada gratuita) · *Incontro letterario: «Il resto di niente» di Enzo Striano* · *Escursione a Baelo Claudia* · *Serata di osservazione astronomica*.

**Trust figures:** Desde 2010 · IX ediciones de la Feria de Italia · Con el Ayuntamiento de Sevilla · Avalada por el Consolato Generale d'Italia y Com.It.Es.

**Real assets to place:**
- Logo: the AIS mark — a green "A" shaped like the Italian peninsula, the Giralda tower as the "I", a red "S" with a small Spanish-flag stripe. **Render it as a transparent vector, never the white-boxed JPG.**
- Hero illustration: `sevilla-italia.png`, 1079×691 — the Seville skyline in sand and coral over green/white/red bands.
- Event posters: portrait 4:5, cream `#F9F9ED` ground with brown `#793421` marker lettering — that is their existing Canva template, and the site must sit comfortably next to it.

---

## 9. RESPONSIVE

Breakpoints: `480 · 768 · 1024 · 1280`.

- Grids: 3-up → 2-up at 1024 → 1-up at 768.
- Hero: side-by-side → stacked at 900px, illustration first on mobile at 16:10, then text.
- The 4:5 event posters keep their ratio at every width.
- Tap targets ≥ 44×44 px; primary buttons 48px tall on mobile.
- Tables and the Feria programme scroll horizontally inside their own container — the page body never scrolls sideways.
- Sticky elements (nav, event poster, guide TOC) unstick below 1024px.
- No hover-only affordances anywhere.

---

## 10. ACCESSIBILITY — non-negotiable

WCAG 2.1 AA. Use the contrast table in §2 as given. Every image gets meaningful alt text (the current site has none). Visible focus rings on everything focusable, never `outline: none`. Colour never carries meaning alone — pair every status colour with an icon or a word. Form labels always visible above their field. One `h1` per page and no skipped heading levels. Text resizes to 200% without loss. Language chips must be real `lang` attributes, not just styling.

---

## 11. DELIVERABLES

Artboards, in this priority order (if you run out of room, stop at the end of a page, never mid-page):

1. Style tile (1440)
2. Homepage desktop (1440)
3. Homepage mobile (390)
4. Header + footer + dropdown open + mobile menu open
5. Convenios index desktop (1440) + mobile (390)
6. **Hazte partner form desktop (1440) + mobile (390) — three states**
7. Events index desktop (1440) + mobile (390)
8. Event detail desktop (1440)
9. Equipo desktop (1440)
10. Colabora / careers desktop (1440), including the empty state
11. Guía práctica article desktop (1440)
12. Component sheet

Label each artboard with the route it represents, e.g. `/es/ventajas-socios/hazte-partner — desktop`.

**Design in Spanish by default.** On the Homepage mobile artboard and the Hazte partner mobile artboard, render the **Italian** version instead, so both languages are visible in the system and I can see how the longer strings behave.

---

## 12. THINGS THAT WILL MAKE ME REJECT IT

- A palette that is not the one in §2.
- The flag used as more than the 3px tricolore rule.
- Event posters cropped to 16:9 or to squares.
- A hero with a stock photo instead of their own illustration.
- Placeholder lorem ipsum where §8 gives real content.
- A partner form that shows all 13 fields at once.
- Any button or nav item that only fits the Spanish string.
- Dark mode. Not needed. Do not spend artboards on it.

---

*ai-generated*
