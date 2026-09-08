/**
 * Home — /es/ and /it/.
 *
 * Rebuilt from AIS Home.dc.html: hero, institutions, upcoming events and
 * partner preview. The hero carries the sevilla-italia.png skyline
 * illustration next to the title.
 */
import { data, routes, routeOf, renderPage, writePage, esc, LOCALES } from '../build.mjs';
import { eventCardHTML, upcomingEvents } from './eventos/index.page.mjs';

const INSTITUTIONS_LABEL = { es: 'Con el apoyo de', it: 'Con il sostegno di' };
const EVENTS_TITLE = { es: 'Próximos eventos', it: 'Prossimi eventi' };
const EVENTS_LINK = { es: 'Ver todo el calendario', it: 'Vedi tutto il calendario' };
const PARTNERS_TITLE = { es: 'Ventajas para socios', it: 'Vantaggi per i soci' };
const PARTNERS_LINK = { es: 'Ver todas las ventajas', it: 'Vedi tutti i vantaggi' };

function partnerCard(item, locale, categories) {
  const cat = categories.find((c) => c.id === item.category);
  const catLabel = cat ? cat.label[locale] : item.category;
  const isPct = item.benefitValue?.type === 'percentage' && typeof item.benefitValue.amount === 'number';
  return `
      <a class="card" href="${routeOf('convenios', locale)}">
        <div class="card-convenio__logo">
          <img src="${esc(item.logo ?? '')}" alt="${esc(item.name)}" width="120" height="64" loading="lazy" decoding="async" style="object-fit:contain;max-height:64px;max-width:100%">
        </div>
        <div class="card-convenio__body">
          <span class="tag">${esc(catLabel)}</span>
          <h3 class="card__title" style="margin:0">${esc(item.name)}</h3>
          <p style="margin:0;font:var(--t-small);color:var(--grigio)">${esc(item.address.street)}, ${esc(item.address.locality)}</p>
          <div class="card-convenio__deal">
            ${isPct ? `<span class="card-convenio__pct">${esc(String(item.benefitValue.amount))}%</span>` : ''}
            <span class="card-convenio__terms">${esc(item.benefit[locale])}</span>
          </div>
        </div>
      </a>`;
}

export default {
  id: 'home',
  async build() {
    for (const locale of LOCALES) {
      const alternates = routes.get('home');
      const upcoming = upcomingEvents().slice(0, 3);
      const partners = data.convenios.items.filter((i) => i.status === 'active').slice(0, 4);
      const categories = data.convenios.categories;

      const eventCards = upcoming.map((ev, i) => eventCardHTML(ev, locale, { eager: i === 0 })).join('\n          ');
      const partnerCards = partners.map((p) => partnerCard(p, locale, categories)).join('\n          ');

      const institutions = data.site.institutions.map((inst) =>
        `<a href="${esc(inst.url)}" rel="noopener" target="_blank" title="${esc(inst.role[locale])}">${esc(inst.name)}</a>`
      ).join('\n        ');

      const eventsSection = upcoming.length ? `
<section class="section section--avorio">
  <div class="wrap">
    <div style="display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:16px;margin-bottom:32px">
      <div>
        <span class="tricolore" aria-hidden="true"><i></i><i></i><i></i></span>
        <h2 style="margin-top:16px">${esc(EVENTS_TITLE[locale])}</h2>
      </div>
      <a class="btn btn--ghost btn--ghost-ruled" href="${routeOf('events', locale)}">${esc(EVENTS_LINK[locale])} →</a>
    </div>
    <div class="grid grid--3">
      ${eventCards}
    </div>
  </div>
</section>` : '';

      const partnersSection = `
<section class="section section--crema">
  <div class="wrap">
    <span class="tricolore" aria-hidden="true"><i></i><i></i><i></i></span>
    <h2 style="margin-top:16px">${esc(PARTNERS_TITLE[locale])}</h2>
    <p class="u-lead" style="margin-top:12px;margin-bottom:32px;max-width:var(--measure-lead)">${esc(locale === 'es' ? 'Descuentos reales en comercios y servicios de Sevilla, negociados por la asociación para quien tiene el carnet.' : 'Sconti reali in negozi e servizi di Siviglia, negoziati dall’associazione per chi ha la tessera.')}</p>
    <div class="grid grid--4" style="margin-bottom:32px">
      ${partnerCards}
    </div>
    <p><a class="btn btn--primary" href="${routeOf('convenios', locale)}">${esc(PARTNERS_LINK[locale])}</a></p>
  </div>
</section>`;

      const heroCtaEvents = EVENTS_LINK[locale];
      const body = `
<section class="section section--crema" style="position:relative;overflow:hidden">
  <div class="wrap" style="position:relative;z-index:1">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center">
      <div>
        <p class="u-label" style="margin-bottom:16px">${esc(locale === 'es' ? 'Sevilla · Desde 2010' : 'Siviglia · Dal 2010')}</p>
        <h1 style="font:var(--t-display);font-variation-settings:var(--fraunces-vars);margin:0 0 24px;max-width:14ch">${esc(data.site.tagline[locale])}</h1>
        <p class="u-lead" style="max-width:var(--measure-lead)">${esc(data.site.elevatorPitch[locale])}</p>
        <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:32px">
          <a class="btn btn--primary" href="${routeOf('join', locale)}">${esc(data.nav.primary.find((i) => i.id === 'join').label[locale])}</a>
          <a class="btn btn--secondary" href="${routeOf('events', locale)}">${esc(heroCtaEvents)}</a>
        </div>
      </div>
      <div style="position:relative;display:flex;align-items:center;justify-content:center">
        <img src="/assets/img/sevilla-italia.png" alt="" width="1079" height="691" loading="lazy" decoding="async" style="max-width:100%;height:auto">
      </div>
    </div>
  </div>
</section>

<section class="section section--avorio" style="padding-block:28px">
  <div class="wrap">
    <p class="u-label" style="margin-bottom:16px">${esc(INSTITUTIONS_LABEL[locale])}</p>
    <div class="institutions">
      ${institutions}
    </div>
  </div>
</section>

${eventsSection}

${partnersSection}`;

      writePage(alternates[locale], renderPage({
        locale,
        alternates,
        activeNav: null,
        title: `${data.site.org.legalName} — ${data.site.tagline[locale]}`,
        description: data.site.elevatorPitch[locale],
        ogImage: '/assets/img/og-default.png',
        body,
      }));
    }
  },
};
