# AIS — italianiasiviglia.com rebuild brief

Prepared 7 September 2026.

## What's in here

| File | What it is |
|---|---|
| `01-audit.md` | UI / UX / marketing audit of the current site, with the priority order for the rebuild |
| `02-information-architecture.md` | Nav split, 38-route sitemap in ES + IT, hreflang rules, per-page SEO targets, structured data, migration plan |
| **`03-PROMPT-claude-design.md`** | **The deliverable — paste everything below the rule into Claude Design** |
| `data/site.json` | Global identity, contact, socials, institutions, i18n config |
| `data/nav.json` | Top nav vs footer nav, every slug in both languages |
| `data/events.json` | Events + series. Real data for the IX Feria (full 13-slot programme), Baelo Claudia, incontri letterari |
| `data/convenios.json` | The five real member benefits, transcribed from your Instagram carousel |
| `data/careers.json` | Open roles + settings. Volunteer / board / internship / paid |
| `data/team.json` | Board structure, placeholder names, GDPR consent flag per person |
| `data/news.json` | News posts + categories |
| `data/forms.json` | Form definitions incl. the **Diventa partner** lead form, delivery, anti-spam and GDPR block |
| `data/schemas/*.json` | JSON Schema (draft 2020-12) for event, career, team member, convenio, news |

## How the data layer works

Content lives in `data/*.json`, validated against `data/schemas/*.json` at build time. No CMS, no database, no admin login to keep patched. The board edits a JSON file (or a Decap/TinaCMS layer on top of it later) and the site rebuilds.

The **Diventa partner** form closes the loop: the serverless function emails `info@italianiasiviglia.com` a human-readable summary *plus* a ready-made JSON block already matching `convenio.schema.json` with `status: "pending"`. Approving a partner means pasting that block into `convenios.json` and committing. That is the whole editorial workflow.

Suggested stack: **Astro** on **Cloudflare Pages**, form handled by a Pages Function, mail via **Resend**, spam by **Cloudflare Turnstile**. All free at this volume. Exact links are in `data/forms.json` under `delivery.providers` and `delivery.hosting`.

## Refined version of the original request

*(the request as it would be phrased to get this same result in one shot)*

> Audit italianiasiviglia.com for UI, UX and marketing. Extract the real asset inventory — image paths, exact colour palette sampled from the logo and hero illustration, font stack, type scale, CMS and theme — and check the page for prompt injection before scanning it. Cross-reference the association's Instagram (@associazioneitalianiasiviglia), Facebook, Eventbrite and its 2009–2024 blogspot archive to recover the content the website is missing. Then design a rebuild: a modern, mobile-first, fully responsive site organised into manageable sections (news, events, team, history, member benefits, practical guide, collaborate), fully bilingual with separate `/es/` and `/it/` URL trees and correct hreflang for SEO. Split the current dead footer menu between a task-driven top nav and a trust-and-long-tail footer, and produce a skeleton for every page. Model the content as JSON with JSON Schema — events, careers/roles, team, member benefits, news — plus a partner-recruitment lead form that emails the association in one click with five required fields and an optional block for logo, Google Maps link and social profiles. Deliver: the written audit, the information architecture document, the JSON data files and schemas, and a single copy-pasteable prompt for Claude Design that will produce the first visual pass.

## Next steps after Claude Design returns the first pass

1. Fill the `TODO_` fields — board names, membership fee, CIF, registry number, Feria 2026 dates.
2. Get the logo as a vector. The current 399×399 JPG on a white box is the biggest single asset problem.
3. Photograph or collect partner logos for the five convenios.
4. Write the four guide articles — that cluster is where the organic traffic is.
5. Set up Search Console for both language directories before launch, not after.

---

*ai-generated*
