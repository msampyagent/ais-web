# italianiasiviglia.com — UI / UX / marketing audit

**Audited:** 7 September 2026 · live site, Instagram, Facebook, the 2009–2024 blogspot archive, Eventbrite, Ayuntamiento de Sevilla press notes
**Verdict:** this is not a site that needs modernising. It is a default WordPress install with a placeholder on it. Treat it as greenfield.

> Security note: both italianiasiviglia.com and the Instagram profile were checked for prompt-injection content. **Nothing found** — no hidden instructions, no text addressed to an automated agent. Both are safe to keep scanning.

---

## 1. What is actually there

| | |
|---|---|
| Platform | WordPress 7.1, theme **Twenty Twenty-Four**, unmodified |
| Pages | 1 real page (`?page_id=2` = "Sample Page", the WP default) + 1 post (`?p=1`, 8 Mar 2025) |
| Permalinks | Query strings (`?p=1`, `?cat=1`) — plain permalinks, never configured |
| Sitemap | `/wp-sitemap.xml` → **404** |
| Meta description | none |
| Open Graph / Twitter cards | none — every share on WhatsApp, Facebook or Instagram DM renders as a bare grey link |
| `<html lang>` | `es`, while ~90% of the visible copy is Italian |
| Analytics | none detected |
| Total page weight | 4 images, 2 scripts, 1 stylesheet — fast only because it is empty |
| Document height | 5 050 px of which maybe 900 px carry information |

**Top nav:** one item — "Sample Page".
**Footer nav:** 9 links, **all pointing at `#`**. Equipo, Historia, Carreras, Política de privacidad, Términos y condiciones, "Contacta con consotros" *(typo — should be "con nosotros")*, Facebook, Instagram, Twitter/X.

The footer is the WP default pattern with the labels half-translated. Facebook and Instagram both go nowhere, even though both accounts exist and are active.

---

## 2. UI

**Palette:** 100% stock Twenty Twenty-Four — `#F9F9F9` base, `#111111` text, `#CFCABE` / `#C2A990` beige accents, a stray `#3D44D9` blue. Not one colour comes from the association's own identity.

**Typography:** Cardo (serif headings) + Inter (body), both self-hosted by the theme. Cardo is a perfectly good face, but H2 and H1 render at the *same* 33.5 px, and H3 drops to 16.8 px Inter — the same size as body text. There is no type scale, so there is no visual hierarchy.

**Layout:** content width 620 px, wide 1280 px. Every section is a centred single column of icon → heading → nothing. Vertical rhythm is enormous and uniform, so nothing reads as more important than anything else.

**Images:** four, and they carry the entire brand:

| Path | Size | What it is |
|---|---|---|
| `/wp-content/uploads/2025/03/logo-Ais.jpg` | 399×399 | The AIS logo. **JPG on a white box** — it needs to be a transparent SVG/PNG, urgently |
| `/wp-content/uploads/2025/04/sevilla-italia.png` | 1079×691 | Seville skyline illustration over the tricolore. The best asset on the site |
| `/wp-content/uploads/2025/04/1743668993473-1024x459.jpg` | 1024×459 | Baelo Claudia excursion photo |
| `/wp-content/uploads/2025/04/1743668993445-724x1024.jpg` | 724×1024 | The IX Feria de Italia poster |

Every one has an **empty `alt`**. Zero accessibility, zero image SEO.

---

## 3. UX

- **Responsive by accident, not by design.** The WP theme reflows, so nothing breaks on a 375 px screen — but the mobile experience is a logo, an email address and a dead black button. Menu is a hamburger containing one item.
- **The primary CTA is a dead end.** "Sitio en construcción" is styled as a button. It does nothing. A visitor's first interactive affordance teaches them the site is broken.
- **No way to act.** No join form, no event registration, no newsletter, no contact form. The only conversion path is copying `info@italianiasiviglia.com` by hand.
- **No dates anywhere.** "Baelo Claudia 2025", "Feria d'Italia" — no when, no where, no how to sign up.
- **Language chaos.** Page is `lang="es"`, the H1 is Spanish, the body copy is Italian, the footer is Spanish. A Spaniard curious about the association reads Italian; an Italian gets a Spanish nav.
- **Institutional credibility is buried.** The Consolato Generale d'Italia, Com.It.Es. and the Ayuntamiento de Sevilla all endorse this association. That evidence exists only as small print inside a JPG poster halfway down the page — invisible to Google and to a skim-reader.

---

## 4. Marketing

**What the association actually has** (none of it on the website):

- **15 years of continuous activity.** Founding act 14 February 2010.
- **A flagship civic event.** The Feria de Italia, now at its IX edition, co-organised with the **Ayuntamiento de Sevilla**, endorsed by the **Consolato Generale d'Italia a Madrid** and **Com.It.Es.**, sponsored by De Cecco, Fabbri, Casa degli Italiani de Barcelona and ~25 local businesses. Free entry, two full days of programming.
- **A live member-benefits scheme.** Five convenios published on Instagram in 2026 alone — Piaceri Italiani (8%), La Cocinera Tremenda (free pasta per €30), Tomares Dental (10%), Lazzo (20%), MYES (10% + 50% matrícula + 3 free lessons). **This is the single strongest reason to join, and it is invisible outside Instagram stories.**
- **Recurring programming:** AIS Bambini, incontri letterari, cineforum, cooking courses, excursions, aperitivi, photo competitions.
- **An Eventbrite organiser account** already set up.
- **211 Instagram posts, 605 followers**, bilingual bio, consistent poster design language.
- **A 15-year blog archive** at `italianiasiviglia.blogspot.com` including the statute and the full board chronology.

**The gap:** all of this lives on Instagram, where it disappears in 24 hours and Google cannot read it. The website — the only asset the association actually owns — contributes nothing.

**Competitive position:** searches like *asociación italianos Sevilla*, *AIRE Sevilla*, *consulado italiano Sevilla*, *dónde comprar productos italianos Sevilla*, *comunidad italiana Andalucía* are currently answered by consulate pages, ciudadanía-italiana lead-gen sites and generic expat blogs. **Nobody owns the Seville-specific, community-run answer.** AIS has the authority to own it and no page to rank with.

**Traffic value ranking** (what a rebuilt site should be optimised around, in order):

1. **Guía práctica cluster** — AIRE, consulate, Com.It.Es. voting, arriving in Seville, where to buy Italian food. Highest search volume, lowest competition, permanent relevance, and it is exactly what the association already answers by DM.
2. **Convenios / ventajas socios** — the conversion engine. Public list, member-only detail. It also recruits partners on its own.
3. **Feria de Italia** — one permanent URL, not a new page per edition. Institutional link magnet (`sevilla.org` already links to the association by name).
4. **Events calendar** — recurring visits, `schema.org/Event` rich results, Google Events eligibility.
5. **Equipo / Historia / Estatutos** — trust signals. Institutions and sponsors check these before signing anything.

---

## 5. Priority order for the rebuild

**P0 — the site is currently a liability**

1. Real URLs, real sitemap, real meta descriptions, Open Graph on every page.
2. Split ES and IT into separate URL trees with correct `hreflang`.
3. Logo as transparent SVG. Alt text on everything.
4. Working footer links, working social links, fix "consotros".
5. One working CTA: *Hazte socio / Associati*.

**P1 — the reasons to visit**

6. Events section with dates, venue, registration and `Event` JSON-LD.
7. Convenios directory + the **Diventa partner** lead form.
8. Team, History, Statutes — the credibility block, with the institutional logos above the fold on the homepage.

**P2 — the reasons to rank**

9. Guía práctica cluster (4–6 long pages, ES + IT).
10. News, gallery, newsletter, Instagram feed embed.
11. Redirect map from the blogspot archive to preserve 15 years of links.

---

*ai-generated*
