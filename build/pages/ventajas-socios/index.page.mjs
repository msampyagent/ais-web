/**
 * Ventajas socios / Convenzioni — /es/ventajas-socios/ and /it/convenzioni/.
 *
 * Source of truth: 1streview/AIS Convenios.dc.html (visual, ES only) and
 * ais-brief/data/convenios.json (content). The artboard only exports the
 * Spanish screens, so every Italian string on this page that is not already
 * approved elsewhere (nav.json, the shared "Gratis · Sin permanencia · Te
 * respondemos en pocos días" reassurance line from AIS Hazte Partner.dc.html,
 * or the "¿Tienes un negocio en Sevilla? / Hai un'attività a Siviglia?"
 * heading pair from 03-PROMPT-claude-design.md §6.E) is new copy, marked
 * NEW below and listed as unvalidated in IMPLEMENTATION-LOG.md.
 *
 * Category filter chips are progressive enhancement only: every card ships
 * in the markup regardless of JavaScript (data-category on each card), and
 * a small inline module script at the end of the page toggles `hidden`.
 * With JavaScript disabled the visitor still gets the full, unfiltered
 * list — same contract as build/pages/eventos/index.page.mjs's filter rail.
 */
import { data, routes, routeOf, renderPage, writePage, esc, LOCALES, ui, ORIGIN } from '../../build.mjs';

/* ---------------------------------------------------------------------------
 * Icons — 24x24, stroke 1.5, colour is always a token reference. Paths are
 * taken verbatim from the artboards, never invented.
 * ------------------------------------------------------------------------- */

const ICON_PATH = {
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
};

function icon(name, { size = 20, color = 'var(--siena)', strokeWidth = 1.5 } = {}) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATH[name]}</svg>`;
}

/**
 * Intrinsic pixel size of each partner logo, read from the files actually
 * committed under assets/convenios/ — used for the <img width>/<height> the
 * a11y and CLS rules require. Keyed by convenio id, not by convenios.json's
 * "logo" path, because one entry ("la-cocinera-tremenda") points at a
 * filename that does not exist on disk (the real file is
 * "cocinera-tremenda.png") — a data bug flagged in IMPLEMENTATION-LOG.md
 * rather than silently patched here.
 */
const LOGO_DIMENSIONS = {
  'piaceri-italiani': [370, 163],
  'la-cocinera-tremenda': [410, 392],
  'tomares-dental': [451, 218],
  lazzo: [375, 350],
  'myes-my-english-school': [391, 393],
};
const LOGO_FALLBACK_DIMENSIONS = [200, 120];

const T = {
  es: {
    home: ui.es.home,
    breadcrumbCurrent: 'Ventajas socios',
    h1: 'Ventajas para socios', // verbatim, AIS Convenios.dc.html desktop H1
    lead: 'Comercios y servicios de Sevilla que ofrecen condiciones especiales a quien tiene el carnet de AIS. Basta con enseñarlo al pagar. La lista crece cada temporada.', // verbatim, artboard
    filtersLabel: 'Filtrar por categoría', // NEW
    all: 'Todas',
    mapLink: 'Ver en el mapa', // NEW
    emptyTitle: 'Aquí cabe tu negocio', // verbatim, artboard
    emptyText: 'Cada convenio nuevo lo anunciamos en Instagram y en la newsletter de socios.', // verbatim, artboard
    emptyCta: 'Hazte partner',
    ctaTitle: '¿Tienes un negocio en Sevilla?', // verbatim, artboard + 03-PROMPT-claude-design.md §6.E
    ctaText: 'Ofrece un descuento a los socios de AIS y date a conocer a la comunidad italiana de la ciudad. Tarda un minuto y no cuesta nada.', // verbatim, artboard
    ctaBullets: ['Gratis', 'Sin permanencia', 'Te respondemos en pocos días'], // verbatim, artboard
    ctaButton: 'Hazte partner',
  },
  it: {
    home: ui.it.home,
    breadcrumbCurrent: 'Convenzioni',
    h1: 'Convenzioni', // reused verbatim from the ES/IT heading pairing in 03-PROMPT-claude-design.md §6.B.3 — NEW as an H1 for this specific page, flagged
    lead: 'Negozi e servizi di Siviglia che offrono condizioni speciali a chi ha la tessera AIS. Basta mostrarla al momento di pagare. La lista cresce ogni stagione.', // NEW, translated from the ES artboard copy
    filtersLabel: 'Filtra per categoria', // NEW
    all: 'Tutte',
    mapLink: 'Vedi sulla mappa', // NEW
    emptyTitle: 'Qui c\u2019è spazio per la tua attività', // NEW
    emptyText: 'Ogni nuova convenzione la annunciamo su Instagram e nella newsletter dei soci.', // NEW
    emptyCta: 'Diventa partner',
    ctaTitle: 'Hai un\u2019attività a Siviglia?', // verbatim, 03-PROMPT-claude-design.md §6.E
    ctaText: 'Offri uno sconto ai soci AIS e fatti conoscere dalla comunità italiana della città. Richiede un minuto e non costa nulla.', // NEW, translated
    ctaBullets: ['Gratis', 'Senza vincoli di durata', 'Ti rispondiamo in pochi giorni'], // verbatim, AIS Hazte Partner.dc.html mobile IT screen
    ctaButton: 'Diventa partner',
  },
};

const DESCRIPTION = {
  es: 'Comercios y servicios de Sevilla con descuentos exclusivos para socios de AIS: restauración, alimentación, salud, formación y más.', // NEW
  it: 'Negozi e servizi di Siviglia con sconti esclusivi per i soci AIS: ristorazione, alimentari, salute, formazione e altro.', // NEW
};

function activeConvenios() {
  const today = new Date().toISOString().slice(0, 10);
  return data.convenios.items.filter((item) => {
    if (item.status !== 'active') return false;
    if (item.validUntil && item.validUntil < today) return false;
    return true;
  });
}

function convenioLd(item, locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: item.name,
    description: item.description[locale],
    ...(item.logo ? { image: `${ORIGIN}${item.logo}` } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: item.address.street,
      addressLocality: item.address.locality,
      ...(item.address.postalCode ? { postalCode: item.address.postalCode } : {}),
      addressCountry: item.address.country || 'ES',
    },
    makesOffer: {
      '@type': 'Offer',
      description: item.benefit[locale],
      seller: { '@type': 'Organization', name: data.site.org.legalName },
    },
  };
}

function convenioCardHTML(item, locale, categories, t) {
  const cat = categories.find((c) => c.id === item.category);
  const catLabel = cat ? cat.label[locale] : item.category;
  const [w, h] = LOGO_DIMENSIONS[item.id] || LOGO_FALLBACK_DIMENSIONS;
  const hasMap = item.geo?.mapsUrl && item.geo.mapsUrl !== 'TODO_google_maps_url';
  const isPercentage = item.benefitValue?.type === 'percentage' && typeof item.benefitValue.amount === 'number';
  const logoHTML = item.logo
    ? `<img src="${esc(item.logo)}" alt="${esc(item.name)}" width="${w}" height="${h}" loading="lazy" decoding="async">`
    : `<span aria-hidden="true" style="font:600 44px/1 var(--font-display);font-variation-settings:var(--fraunces-vars);color:var(--siena)">${esc(item.name.slice(0, 1))}</span>`;

  return `
        <div class="card" data-category="${esc(item.category)}">
          <div class="card-convenio__logo">
            ${logoHTML}
          </div>
          <div class="card-convenio__body">
            <span class="tag">${esc(catLabel)}</span>
            <h3 class="card__title" style="margin:0">${esc(item.name)}</h3>
            <p style="margin:0">${esc(item.description[locale])}</p>
            <div class="card__meta" style="margin:0">
              ${icon('pin')}
              <span>${esc(item.address.street)}, ${esc(item.address.locality)}</span>
            </div>
            ${hasMap ? `<a href="${esc(item.geo.mapsUrl)}" rel="noopener" target="_blank">${esc(t.mapLink)}</a>` : ''}
            <div class="card-convenio__deal">
              ${isPercentage ? `<span class="card-convenio__pct">${esc(String(item.benefitValue.amount))}%</span>` : ''}
              <span class="card-convenio__terms">${esc(item.benefit[locale])}</span>
            </div>
          </div>
        </div>`;
}

function teaserCardHTML(locale, t) {
  return `
        <div class="card" style="border:1.5px dashed var(--linea-forte);box-shadow:none;background:transparent;display:flex;flex-direction:column;justify-content:center;gap:12px;padding:28px;min-height:300px">
          <img src="/assets/img/giralda.png" alt="" width="11" height="36" loading="lazy" decoding="async" style="height:36px;width:auto;align-self:flex-start">
          <p class="card__title" style="margin:0">${esc(t.emptyTitle)}</p>
          <p style="margin:0">${esc(t.emptyText)}</p>
          <a href="${routeOf('become-partner', locale)}" style="display:flex;align-items:center;gap:8px;font:600 17px/1 var(--font-ui);color:var(--siena);margin-top:4px">${esc(t.emptyCta)} ${icon('arrow', { size: 18 })}</a>
        </div>`;
}

function ctaPanelHTML(locale, t) {
  const bullets = t.ctaBullets.map((b) => `
          <div style="display:flex;gap:14px;align-items:center">
            ${icon('check', { size: 24 })}
            <span style="font:600 20px/1.35 var(--font-ui);color:var(--inchiostro)">${esc(b)}</span>
          </div>`).join('');
  return `
    <div style="background:var(--sabbia);border-radius:var(--r-lg);padding:64px;position:relative;overflow:hidden;margin-top:64px">
      <div class="cta-panel-grid" style="display:grid;grid-template-columns:1.3fr 1fr;gap:64px;align-items:center">
        <div>
          <span class="tricolore" aria-hidden="true"><i></i><i></i><i></i></span>
          <h2 style="margin:16px 0 16px;max-width:20ch">${esc(t.ctaTitle)}</h2>
          <p style="margin:0 0 28px;max-width:52ch;color:var(--inchiostro);font:var(--t-lead)">${esc(t.ctaText)}</p>
          <a class="btn btn--primary" href="${routeOf('become-partner', locale)}">${esc(t.ctaButton)}</a>
        </div>
        <div style="display:flex;flex-direction:column;gap:14px">
          ${bullets}
        </div>
      </div>
    </div>`;
}

export default {
  id: 'convenios',
  async build() {
    const items = activeConvenios();
    const categories = data.convenios.categories;
    const categoryCounts = new Map();
    items.forEach((i) => categoryCounts.set(i.category, (categoryCounts.get(i.category) || 0) + 1));
    const categoriesInUse = categories.filter((c) => categoryCounts.has(c.id));

    for (const locale of LOCALES) {
      const alternates = routes.get('convenios');
      const t = T[locale];

      const chips = [
        `<button type="button" class="chip chip--active" data-category-filter="all" aria-pressed="true">${esc(t.all)} · ${items.length}</button>`,
        ...categoriesInUse.map((c) =>
          `<button type="button" class="chip" data-category-filter="${esc(c.id)}" aria-pressed="false">${esc(c.label[locale])}</button>`
        ),
      ].join('\n          ');

      const cards = items.map((item) => convenioCardHTML(item, locale, categories, t)).join('\n');

      const body = `
<section class="section section--crema">
  <div class="wrap">
    <nav class="breadcrumb" aria-label="${esc(ui[locale].breadcrumbLabel)}">
      <ol>
        <li><a href="${routeOf('home', locale)}">${esc(t.home)}</a></li>
        <li aria-current="page">${esc(t.breadcrumbCurrent)}</li>
      </ol>
    </nav>
    <span class="tricolore" aria-hidden="true"><i></i><i></i><i></i></span>
    <h1>${esc(t.h1)}</h1>
    <p class="u-lead">${esc(t.lead)}</p>

    <div role="group" aria-label="${esc(t.filtersLabel)}" style="display:flex;flex-wrap:wrap;gap:12px;margin:32px 0" data-convenio-filters>
          ${chips}
    </div>

    <div class="grid grid--3" data-convenio-grid>
${cards}
${teaserCardHTML(locale, t)}
    </div>

    ${ctaPanelHTML(locale, t)}
  </div>
</section>
<script type="module">
(function () {
  var filters = document.querySelector('[data-convenio-filters]');
  var grid = document.querySelector('[data-convenio-grid]');
  if (!filters || !grid) return;
  var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-category]'));
  filters.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('[data-category-filter]') : null;
    if (!btn) return;
    var value = btn.getAttribute('data-category-filter');
    Array.prototype.forEach.call(filters.querySelectorAll('[data-category-filter]'), function (b) {
      var active = b === btn;
      b.classList.toggle('chip--active', active);
      b.setAttribute('aria-pressed', String(active));
    });
    cards.forEach(function (card) {
      card.hidden = !(value === 'all' || card.getAttribute('data-category') === value);
    });
  });
})();
</script>`;

      writePage(alternates[locale], renderPage({
        locale,
        alternates,
        activeNav: 'convenios',
        title: `${t.h1} — ${data.site.org.legalName}`,
        description: DESCRIPTION[locale],
        breadcrumb: [
          { label: t.home, href: routeOf('home', locale) },
          { label: t.breadcrumbCurrent, href: alternates[locale] },
        ],
        jsonld: items.map((item) => convenioLd(item, locale)),
        body,
      }));
    }
  },
};
