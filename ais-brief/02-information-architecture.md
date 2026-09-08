# Information architecture, sitemap and SEO map

**Decisions locked:** `/es/` + `/it/` symmetric prefixes, root redirects · static site, JSON-driven · Seville-ochre + tricolore art direction.

---

## 1. Navigation split

The old footer dumped everything into three anonymous columns. The rule now: **the top bar carries tasks, the footer carries trust and long tail.**

### Top bar — 6 slots, no more

| Slot | ES | IT | Why it earns a top slot |
|---|---|---|---|
| 1 | La Asociación ▾ | L'Associazione ▾ | First question a newcomer and an institution both ask |
| 2 | Eventos ▾ | Eventi ▾ | The recurring-visit driver |
| 3 | Ventajas socios | Convenzioni | The conversion argument, promoted out of the footer |
| 4 | Guía práctica ▾ | Guida pratica ▾ | The organic-traffic front door |
| 5 | Noticias | Notizie | Freshness signal |
| 6 | **Hazte socio** | **Associati** | Solid button, `siena` fill, never a plain link |

Utility rail, right of the nav: language switcher (ES · IT), search, contact.

### Footer — 4 columns

| La Asociación / L'Associazione | Participa / Partecipa | Recursos / Risorse | Legal y contacto |
|---|---|---|---|
| Quiénes somos · Chi siamo | Hazte socio · Associati | Guía práctica · Guida pratica | Contacto · Contatti |
| Equipo · Direttivo | Ventajas socios · Convenzioni | Preguntas frecuentes · FAQ | Política de privacidad · Privacy |
| Historia · Storia | **Hazte partner · Diventa partner** | Directorio · Directory | Política de cookies · Cookie |
| Estatutos y transparencia · Statuto | Voluntariado · Volontariato | Galería · Galleria | Aviso legal · Note legali |
| Prensa · Stampa | Patrocinar la Feria · Sponsor | Archivo 2009-2024 ↗ | Accesibilidad · Accessibilità |
| Colabora · Collabora | Newsletter | | |

Footer bottom: institutional logo row (Ayuntamiento de Sevilla · Consolato Generale d'Italia · Com.It.Es.), social icons, copyright.

**Removed from the old footer:** Twitter/X (no account), "Términos y condiciones" (wrong term for an association — it is *Aviso legal*), "Carreras" (renamed *Colabora / Collabora*: an association recruits volunteers, not careers — the JSON still supports paid roles if one ever appears).

---

## 2. Full URL map

Every row is one page in two languages, reciprocally linked with `hreflang`. `x-default` → the ES URL.

| # | ES URL | IT URL | Data source | Priority |
|---|---|---|---|---|
| 1 | `/es/` | `/it/` | site.json + all | 1.0 |
| 2 | `/es/asociacion/quienes-somos` | `/it/associazione/chi-siamo` | static | 0.8 |
| 3 | `/es/asociacion/equipo` | `/it/associazione/direttivo` | **team.json** | 0.7 |
| 4 | `/es/asociacion/historia` | `/it/associazione/storia` | static + timeline | 0.7 |
| 5 | `/es/asociacion/estatutos` | `/it/associazione/statuto` | static + PDF | 0.5 |
| 6 | `/es/eventos` | `/it/eventi` | **events.json** | 0.9 |
| 7 | `/es/eventos/{slug}` | `/it/eventi/{slug}` | events.json | 0.6 |
| 8 | `/es/eventos/feria-de-italia` | `/it/eventi/feria-de-italia` | events.json (series) | 0.9 |
| 9 | `/es/eventos/feria-de-italia/patrocinio` | `/it/eventi/feria-de-italia/sponsor` | static + form | 0.5 |
| 10 | `/es/eventos/ais-bambini` | `/it/eventi/ais-bambini` | events.json (series) | 0.6 |
| 11 | `/es/eventos/encuentros-literarios` | `/it/eventi/incontri-letterari` | events.json (series) | 0.6 |
| 12 | `/es/eventos/archivo` | `/it/eventi/archivio` | events.json (past) | 0.4 |
| 13 | `/es/ventajas-socios` | `/it/convenzioni` | **convenios.json** | 0.9 |
| 14 | `/es/ventajas-socios/{slug}` | `/it/convenzioni/{slug}` | convenios.json | 0.5 |
| 15 | `/es/ventajas-socios/hazte-partner` | `/it/convenzioni/diventa-partner` | **forms.json** | 0.7 |
| 16 | `/es/guia-italianos-sevilla` | `/it/guida-italiani-siviglia` | static hub | 0.9 |
| 17 | `/es/guia-italianos-sevilla/aire-consulado` | `/it/guida-italiani-siviglia/aire-consolato` | static | 0.8 |
| 18 | `/es/guia-italianos-sevilla/comites-voto` | `/it/guida-italiani-siviglia/comites-voto` | static | 0.7 |
| 19 | `/es/guia-italianos-sevilla/llegar-a-sevilla` | `/it/guida-italiani-siviglia/arrivare-a-siviglia` | static | 0.8 |
| 20 | `/es/guia-italianos-sevilla/comprar-productos-italianos` | `/it/guida-italiani-siviglia/comprare-prodotti-italiani` | static + convenios | 0.8 |
| 21 | `/es/noticias` | `/it/notizie` | **news.json** | 0.7 |
| 22 | `/es/noticias/{slug}` | `/it/notizie/{slug}` | news.json | 0.5 |
| 23 | `/es/hazte-socio` | `/it/associati` | forms.json | 1.0 |
| 24 | `/es/colabora` | `/it/collabora` | **careers.json** | 0.6 |
| 25 | `/es/colabora/{roleId}` | `/it/collabora/{roleId}` | careers.json | 0.4 |
| 26 | `/es/colabora/voluntariado` | `/it/collabora/volontariato` | static | 0.5 |
| 27 | `/es/directorio` | `/it/directory` | convenios.json + extras | 0.6 |
| 28 | `/es/galeria` | `/it/galleria` | events.json galleries | 0.4 |
| 29 | `/es/prensa` | `/it/stampa` | static | 0.4 |
| 30 | `/es/faq` | `/it/faq` | static | 0.6 |
| 31 | `/es/contacto` | `/it/contatti` | forms.json | 0.7 |
| 32 | `/es/newsletter` | `/it/newsletter` | forms.json | 0.4 |
| 33 | `/es/legal/privacidad` | `/it/legale/privacy` | static | 0.2 |
| 34 | `/es/legal/cookies` | `/it/legale/cookie` | static | 0.2 |
| 35 | `/es/legal/aviso-legal` | `/it/legale/note-legali` | static | 0.2 |
| 36 | `/es/legal/accesibilidad` | `/it/legale/accessibilita` | static | 0.2 |
| 37 | `/es/buscar` | `/it/cerca` | client-side index | — |
| 38 | `/es/404` | `/it/404` | static | — |

**38 routes × 2 locales = 76 pages** (plus generated detail pages from the JSON collections).

---

## 3. hreflang and root behaviour

On every page, three tags:

```html
<link rel="alternate" hreflang="es-ES" href="https://italianiasiviglia.com/es/eventos" />
<link rel="alternate" hreflang="it-IT" href="https://italianiasiviglia.com/it/eventi" />
<link rel="alternate" hreflang="x-default" href="https://italianiasiviglia.com/es/eventos" />
```

- `/` → 302 to `/es/` or `/it/` based on `Accept-Language`, with a `?lang=` override that sets a preference cookie. **Never 301** the root — a permanent redirect on a language sniff poisons the cache for the other language.
- The language switcher must land on the **equivalent page**, not the homepage. That is the whole reason the slug pairs live in `nav.json`.
- Two sitemaps (`sitemap-es.xml`, `sitemap-it.xml`) in a sitemap index, each carrying `xhtml:link` alternates.
- Canonical is always self-referencing, never cross-language.

---

## 4. Per-page SEO targets

| Page | Primary keyword (ES) | Primary keyword (IT) | Title (ES) |
|---|---|---|---|
| Home | asociación italianos Sevilla | associazione italiani Siviglia | Asociación Italiani a Siviglia — La comunidad italiana de Sevilla desde 2010 |
| Guía hub | italianos en Sevilla | italiani a Siviglia | Guía para italianos en Sevilla: trámites, comunidad y vida diaria |
| AIRE | AIRE Sevilla / consulado italiano Sevilla | AIRE Siviglia / consolato italiano Siviglia | AIRE y consulado italiano desde Sevilla: cómo hacerlo paso a paso |
| Com.It.Es. | Com.It.Es. España voto | Com.It.Es. Spagna voto | Com.It.Es.: qué es, para qué se vota y quién puede votar |
| Llegar | mudarse a Sevilla italiano | trasferirsi a Siviglia | Mudarse a Sevilla siendo italiano: NIE, empadronamiento, sanidad |
| Comprar italiano | productos italianos Sevilla | prodotti italiani Siviglia | Dónde comprar productos italianos en Sevilla |
| Convenios | descuentos italianos Sevilla | sconti soci AIS Siviglia | Ventajas para socios: descuentos en Sevilla |
| Feria | Feria de Italia Sevilla | Feria de Italia Siviglia | Feria de Italia Sevilla — programa, fechas y entradas |
| Eventos | eventos italianos Sevilla | eventi italiani Siviglia | Eventos de la comunidad italiana en Sevilla |
| Hazte socio | hacerse socio asociación italiana Sevilla | associarsi AIS Siviglia | Hazte socio de AIS — ventajas, cuota y cómo apuntarte |

Meta descriptions: 150–158 characters, written per language, never machine-translated.

---

## 5. Structured data

| Page | JSON-LD type |
|---|---|
| All | `Organization` (+ `logo`, `foundingDate: 2010-02-14`, `sameAs[]` for IG/FB/Eventbrite/blogspot) |
| All | `BreadcrumbList` |
| Event pages | `Event` (`eventStatus`, `eventAttendanceMode`, `location`, `offers`, `organizer`, `image`) |
| Feria | `Event` + `Festival` |
| Convenio pages | `LocalBusiness` for the partner + `Offer` for the benefit |
| Guide pages | `Article` + `FAQPage` where there is a Q&A block |
| Paid roles only | `JobPosting` — **never for volunteer roles**, Google rejects unpaid postings |
| Contact | `ContactPoint` |

---

## 6. Migration and link preservation

- Map the WordPress query-string URLs (`?p=1`, `?page_id=2`, `?cat=1`) → 301 to `/es/`.
- Keep `italianiasiviglia.blogspot.com` alive; add a canonical pointing at the equivalent new page where one exists, and link the archive from the footer. Fifteen years of inbound links are worth more than tidiness.
- `sevilla.org` links to the association by name in at least two press notes — request the link be updated to `/es/eventos/feria-de-italia`.
- Register the site in Google Search Console for both language directories, and submit both sitemaps.

---

*ai-generated*
