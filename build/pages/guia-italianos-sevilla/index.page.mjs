/**
 * Guía práctica — hub page (/es/guia-italianos-sevilla/, /it/guida-italiani-siviglia/)
 * plus the shared layout/markup helpers used by the four article pages in
 * this directory (aire-consulado, comites-voto, llegar-a-sevilla,
 * comprar-productos-italianos), the same "hub file exports helpers, hub
 * file is also a page" pattern as build/pages/eventos/index.page.mjs.
 *
 * Source of truth: 1streview/AIS Guia Practica.dc.html shows exactly one
 * article ("AIRE y consulado") in full desktop detail. That artboard is the
 * template every article below follows structurally: breadcrumb, tricolore,
 * h1, lead, reading-time/updated meta, an in-page "En esta página" index, a
 * callout of official links, numbered steps, a bulleted document list, a
 * pull quote, an FAQ accordion, a "Sigue leyendo" related-articles grid and
 * a closing membership CTA.
 *
 * Two deliberate departures from a pixel-literal copy of the artboard, both
 * because assets/css/** is off limits to this build stream (see
 * build/pages/README.md rule 4 and AGENTS.md — no new component classes):
 *   1. The artboard's sticky two-sidebar 3-column layout (a left TOC/share
 *      rail and a right "sigue leyendo" rail, both `position: sticky`) has
 *      no equivalent in assets/css/components.css. There is no grid/sticky
 *      primitive to reuse without inventing one, so this build renders a
 *      single reading column (matching legal/privacy.page.mjs and
 *      legal/cookies.page.mjs): the TOC sits inline near the top, "Sigue
 *      leyendo" sits as a card grid at the end. Content and copy are
 *      unchanged; only the sidebar chrome is flattened to one column.
 *   2. The artboard's closing CTA is a `--sabbia` (#FEC191) rounded panel.
 *      This build already spends its one non-`--crema` background on the
 *      `.callout` (`--avorio`) used for "Enlaces oficiales" — a third
 *      colour would break the two-background-per-page rule (AGENTS.md
 *      1.5), so the CTA reuses `.callout` too rather than introducing a
 *      `--sabbia` panel.
 *   3. The numbered-step list ("Cómo inscribirse desde Sevilla") uses a
 *      custom 32px circular siena badge in the artboard. No such component
 *      exists in components.css, so steps render as a plain `<ol>` inside
 *      `.prose`, which still numbers itself (browser default marker) — the
 *      content and order are identical, only the numeral's chrome differs.
 *
 * Every ES string that is copied character-for-character from
 * 1streview/AIS Guia Practica.dc.html is marked "verbatim" in the comment
 * next to it. Everything else — all Italian chrome (that artboard is
 * ES-only), the two extra AIRE sections the mockup's TOC promises but never
 * writes out ("Cambiar de dirección", "Renovar el pasaporte"), three of the
 * four FAQ answers, and all copy for comites-voto / llegar-a-sevilla /
 * comprar-productos-italianos (no artboard covers any of the three) — is
 * new copy written for this build in the same dry, concrete register, and
 * is listed as unvalidated in IMPLEMENTATION-LOG.md per build/pages/README
 * rule 5 / CLAUDE.md.
 *
 * The "X minutos de lectura" badge is computed from the actual word count
 * of each article (~200 words/minute) rather than kept at the artboard's
 * static "7 minutos" — this build's AIRE article is longer than the
 * mockup's excerpt (it adds the two missing sections), so keeping "7"
 * verbatim would under-report it. Documented in IMPLEMENTATION-LOG.md.
 */
import { data, routes, routeOf, renderPage, writePage, esc, LOCALES } from '../../build.mjs';

/* ---------------------------------------------------------------------------
 * Icons — 24×24, stroke 1.5, matching the artboard's own inline SVGs.
 * ------------------------------------------------------------------------- */

const ICON_PATH = {
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 7v5l3 2"/>',
  calendar: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M3 10h18"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
};

export function icon(name, { size = 18, color = 'var(--siena)' } = {}) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATH[name]}</svg>`;
}

/* ---------------------------------------------------------------------------
 * The four articles. Titles are copied verbatim from nav.json (the route
 * labels shown in the header dropdown). Teasers for comites/arrive/
 * italianfood are copied verbatim from the "Sigue leyendo" cards visible in
 * the AIRE article artboard; the AIRE teaser itself is new (the artboard
 * never shows a teaser for the page it is currently on).
 * ------------------------------------------------------------------------- */

export const GUIDE_ARTICLES = [
  {
    id: 'aire',
    title: { es: 'AIRE y consulado', it: 'AIRE e consolato' }, // verbatim, nav.json
    teaser: {
      es: 'Inscripción en el AIRE y trámites con el consulado.', // NEW
      it: 'Iscrizione all’AIRE e pratiche con il consolato.', // NEW
    },
  },
  {
    id: 'comites',
    title: { es: 'Com.It.Es. y voto', it: 'Com.It.Es. e voto' }, // verbatim, nav.json
    teaser: {
      es: 'Qué es y cómo votar desde el extranjero.', // verbatim, artboard "sigue leyendo"
      it: 'Cos’è e come votare dall’estero.', // NEW
    },
  },
  {
    id: 'arrive',
    title: { es: 'Llegar a Sevilla', it: 'Arrivare a Siviglia' }, // verbatim, nav.json
    teaser: {
      es: 'Empadronamiento, NIE, sanidad y piso.', // verbatim, artboard "sigue leyendo"
      it: 'Residenza anagrafica, NIE, sanità e casa.', // NEW
    },
  },
  {
    id: 'italianfood',
    title: { es: 'Dónde comprar italiano', it: 'Dove comprare italiano' }, // verbatim, nav.json
    teaser: {
      es: 'Tiendas y mercados con producto de verdad.', // verbatim, artboard "sigue leyendo"
      it: 'Negozi e mercati con prodotti veri.', // NEW
    },
  },
];

/* ---------------------------------------------------------------------------
 * Shared chrome strings.
 * ------------------------------------------------------------------------- */

export const T = {
  es: {
    home: 'Inicio', // verbatim, ui.es.home
    guideLabel: 'Guía práctica', // verbatim, nav.json
    minRead: 'minutos de lectura', // verbatim, artboard
    updatedLabel: 'Actualizado en', // verbatim, artboard
    updatedText: 'septiembre de 2026', // verbatim, artboard
    onThisPage: 'En esta página', // verbatim, artboard
    keepReading: 'Sigue leyendo', // verbatim, artboard
    faqTitle: 'Preguntas frecuentes', // verbatim, artboard
    joinTitle: '¿Te ayudamos?', // verbatim, artboard
    joinTextGeneric: 'La red de socios de AIS ya ha pasado por esto. Ven a un encuentro y pregunta — se contesta en persona y en el grupo.', // NEW
    joinCta: 'Hazte socio', // verbatim, nav.json
    officialLinksLabel: 'Enlaces oficiales', // verbatim, artboard
    hubTitle: 'Guía práctica', // verbatim, nav.json
    hubLead: 'Trámites, votaciones, la llegada a Sevilla y dónde encontrar productos italianos — explicado por la asociación, sin lenguaje administrativo.', // NEW
    readArticle: 'Leer el artículo', // NEW
  },
  it: {
    home: 'Home', // NEW
    guideLabel: 'Guida pratica', // verbatim, nav.json
    minRead: 'minuti di lettura', // NEW
    updatedLabel: 'Aggiornato a', // NEW
    updatedText: 'settembre 2026', // NEW
    onThisPage: 'In questa pagina', // NEW
    keepReading: 'Continua a leggere', // NEW
    faqTitle: 'Domande frequenti', // NEW
    joinTitle: 'Ti aiutiamo?', // NEW
    joinTextGeneric: 'La rete dei soci AIS è già passata da qui. Vieni a un incontro e chiedi — si risponde di persona e nel gruppo.', // NEW
    joinCta: 'Associati', // verbatim, nav.json
    officialLinksLabel: 'Link ufficiali', // NEW
    hubTitle: 'Guida pratica', // verbatim, nav.json
    hubLead: 'Pratiche, votazioni, l’arrivo a Siviglia e dove trovare prodotti italiani — spiegato dall’associazione, senza linguaggio burocratico.', // NEW
    readArticle: 'Leggi l’articolo', // NEW
  },
};

/* ---------------------------------------------------------------------------
 * Small building blocks reused by every article.
 * ------------------------------------------------------------------------- */

export function breadcrumbNav(locale, trail) {
  const label = locale === 'es' ? 'Ruta de navegación' : 'Percorso di navigazione';
  const items = trail.map((t, i) => (
    i === trail.length - 1
      ? `<li aria-current="page">${esc(t.label)}</li>`
      : `<li><a href="${t.href}">${esc(t.label)}</a></li>`
  )).join('');
  return `<nav class="breadcrumb" aria-label="${label}"><ol>${items}</ol></nav>`;
}

/** Word count / 200wpm, HTML-tag-stripped. Never invented — derived from the
 *  actual copy passed in, so it stays honest as articles change. */
export function estimateReadingMinutes(html) {
  const text = html.replace(/<[^>]+>/g, ' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round(words / 200));
}

export function tocList(sections) {
  const items = sections.map((s) => `<li><a href="#${s.id}">${esc(s.label)}</a></li>`).join('');
  return `<ul>${items}</ul>`;
}

/** The "Enlaces oficiales" callout. Links are only ever URLs already present
 *  in ais-brief/data/*.json (site.json institutions) or literal domains
 *  printed in the artboard itself — never a government URL invented for
 *  this build. See IMPLEMENTATION-LOG.md. */
export function officialLinksCallout(locale, { intro, links }) {
  const t = T[locale];
  const items = links.map((l) =>
    `<li><a href="${l.href}" rel="noopener" target="_blank">${esc(l.label)} ↗</a></li>`
  ).join('');
  return `
      <div class="callout">
        <p class="callout__label">${esc(t.officialLinksLabel)}</p>
        <p>${intro}</p>
        <ul class="list-giralda">${items}</ul>
      </div>`;
}

export function documentsList(items) {
  return `<ul class="list-giralda">${items.map((t) => `<li>${t}</li>`).join('')}</ul>`;
}

export function stepsList(items) {
  return `<ol>${items.map((t) => `<li>${t}</li>`).join('')}</ol>`;
}

let accordionSeq = 0;

/** FAQ accordion. Server-rendered fully open (no `hidden`, aria-expanded
 *  "true") so the content is complete and readable with JavaScript
 *  disabled — assets/js/accordion.js is what collapses it once it knows JS
 *  actually runs. See assets/js/accordion.js for the toggle logic. */
export function faqAccordion(items) {
  const prefix = `faq-${++accordionSeq}`;
  const rows = items.map((item, i) => {
    const tid = `${prefix}-t${i}`;
    const pid = `${prefix}-p${i}`;
    return `
        <div class="accordion__item">
          <button type="button" class="accordion__trigger" id="${tid}" aria-expanded="true" aria-controls="${pid}" data-accordion-trigger>
            <span>${item.q}</span>
            ${icon('chevronDown', { size: 22 })}
          </button>
          <div class="accordion__panel" id="${pid}" role="region" aria-labelledby="${tid}">
            <p>${item.a}</p>
          </div>
        </div>`;
  }).join('');
  return `<div class="accordion">${rows}</div>`;
}

export function relatedGrid(locale, currentId) {
  const t = T[locale];
  const others = GUIDE_ARTICLES.filter((a) => a.id !== currentId);
  const cards = others.map((a) => `
        <a class="card" href="${routeOf(a.id, locale)}">
          <div class="card__body">
            <p class="card__title">${esc(a.title[locale])}</p>
            <p class="u-small">${esc(a.teaser[locale])}</p>
          </div>
        </a>`).join('');
  return `
      <div>
        <p class="u-label">${esc(t.keepReading)}</p>
        <div class="grid grid--3">${cards}</div>
      </div>`;
}

export function joinCallout(locale, text) {
  const t = T[locale];
  return `
      <div class="callout">
        <h2>${esc(t.joinTitle)}</h2>
        <p>${text ?? t.joinTextGeneric}</p>
        <p><a class="btn btn--primary" href="${routeOf('join', locale)}">${esc(t.joinCta)}</a></p>
      </div>`;
}

/**
 * Full article shell shared by the four article pages: breadcrumb,
 * tricolore, h1, lead, reading meta, TOC, prose body, FAQ, related grid,
 * join CTA. Callers supply the prose body (already containing `<h2 id=…>`
 * for every entry in `sections`) and the FAQ items.
 */
export function articleShell({ locale, articleId, lead, joinText, bodyHtml, sections, faq }) {
  const t = T[locale];
  const article = GUIDE_ARTICLES.find((a) => a.id === articleId);
  const minutes = estimateReadingMinutes(bodyHtml);
  const trail = [
    { label: t.home, href: routeOf('home', locale) },
    { label: t.guideLabel, href: routeOf('guide', locale) },
    { label: article.title[locale] },
  ];

  return `
<section class="section section--crema">
  <div class="wrap">
    ${breadcrumbNav(locale, trail)}
    <span class="tricolore" aria-hidden="true"><i></i><i></i><i></i></span>
    <h1>${esc(article.title[locale])}</h1>
    <p class="u-lead">${lead}</p>
    <p class="card__meta">${icon('clock')}<span>${minutes} ${esc(t.minRead)}</span><span aria-hidden="true">·</span>${icon('calendar')}<span>${esc(t.updatedLabel)} ${esc(t.updatedText)}</span></p>

    <nav class="u-measure" aria-label="${esc(t.onThisPage)}">
      <p class="u-label">${esc(t.onThisPage)}</p>
      ${tocList(sections)}
    </nav>

    <div class="prose">
      ${bodyHtml}

      <h2>${esc(t.faqTitle)}</h2>
      ${faqAccordion(faq)}
    </div>

    ${joinCallout(locale, joinText)}

    ${relatedGrid(locale, articleId)}
  </div>
</section>`;
}

/** Article + FAQPage JSON-LD, per 02-information-architecture.md's mapping
 *  for guide pages. Dates are deliberately omitted rather than invented —
 *  nothing in ais-brief/data records when this new copy was authored. */
export function articleJsonLd(locale, { headline, description }, faqItems) {
  const ld = [{
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    inLanguage: locale,
    author: { '@type': 'Organization', name: data.site.org.legalName },
    publisher: { '@type': 'Organization', name: data.site.org.legalName },
  }];
  if (faqItems?.length) {
    ld.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: stripTags(item.q),
        acceptedAnswer: { '@type': 'Answer', text: stripTags(item.a) },
      })),
    });
  }
  return ld;
}

export function stripTags(html) {
  return html.replace(/<[^>]+>/g, '').trim();
}

/* ---------------------------------------------------------------------------
 * The hub page itself: /es/guia-italianos-sevilla/, /it/guida-italiani-siviglia/
 * ------------------------------------------------------------------------- */

const DESCRIPTION = {
  es: 'Guía práctica de AIS para italianos en Sevilla: AIRE y consulado, Com.It.Es. y voto, llegar a Sevilla y dónde comprar productos italianos.',
  it: 'Guida pratica di AIS per italiani a Siviglia: AIRE e consolato, Com.It.Es. e voto, arrivare a Siviglia e dove comprare prodotti italiani.',
};

export default {
  id: 'guide',
  async build() {
    for (const locale of LOCALES) {
      const alternates = routes.get('guide');
      const t = T[locale];

      const cards = GUIDE_ARTICLES.map((a) => `
        <a class="card" href="${routeOf(a.id, locale)}">
          <div class="card__body">
            <p class="card__title">${esc(a.title[locale])}</p>
            <p>${esc(a.teaser[locale])}</p>
            <p class="u-small">${esc(t.readArticle)} →</p>
          </div>
        </a>`).join('');

      const body = `
<section class="section section--crema">
  <div class="wrap">
    <nav class="breadcrumb" aria-label="${locale === 'es' ? 'Ruta de navegación' : 'Percorso di navigazione'}">
      <ol>
        <li><a href="${routeOf('home', locale)}">${esc(t.home)}</a></li>
        <li aria-current="page">${esc(t.hubTitle)}</li>
      </ol>
    </nav>
    <span class="tricolore" aria-hidden="true"><i></i><i></i><i></i></span>
    <h1>${esc(t.hubTitle)}</h1>
    <p class="u-lead">${esc(t.hubLead)}</p>

    <div class="grid grid--2">
      ${cards}
    </div>
  </div>
</section>`;

      writePage(alternates[locale], renderPage({
        locale,
        alternates,
        activeNav: 'guide',
        title: `${t.hubTitle} — ${data.site.org.legalName}`,
        description: DESCRIPTION[locale],
        breadcrumb: [
          { label: t.home, href: routeOf('home', locale) },
          { label: t.hubTitle, href: alternates[locale] },
        ],
        body,
      }));
    }
  },
};
