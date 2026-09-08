/**
 * Feria, AIS Bambini, Encuentros literarios — series landing pages.
 *
 * One module writes the three series routes declared in nav.json (feria,
 * bambini, letterari). It filters events.json by series, splits upcoming
 * from past, and reuses the card helpers in index.page.mjs.
 */
import { data, routeOf, routes, renderPage, writePage, esc, LOCALES } from '../../build.mjs';
import { T, listableEvents, eventCardHTML, emptyStateHTML, seriesLabel, breadcrumb, baseTrail, effectiveStatus } from './index.page.mjs';

const SERIES_ROUTE_ID = {
  'feria-de-italia': 'feria',
  'ais-bambini': 'bambini',
  'incontri-letterari': 'letterari',
};

function seriesDescription(seriesId, locale) {
  const s = data.events.series.find((x) => x.id === seriesId);
  return s?.description?.[locale] ?? (locale === 'es' ? 'Actividades de la Asociación Italiani a Siviglia.' : 'Attività dell’Associazione Italiani a Siviglia.');
}

function seriesBody(locale, routeId, seriesId) {
  const t = T[locale];
  const navItem = data.nav.primary.find((i) => i.id === 'events').children.find((c) => c.id === routeId);
  const label = navItem ? navItem.label[locale] : seriesLabel(seriesId, locale);
  const all = listableEvents().filter((ev) => ev.series === seriesId);
  const upcoming = all.filter((ev) => effectiveStatus(ev) === 'published');
  const past = all.filter((ev) => effectiveStatus(ev) === 'past');

  const upcomingCards = upcoming.map((ev) => eventCardHTML(ev, locale)).join('\n          ');
  const pastCards = past.map((ev) => eventCardHTML(ev, locale, { compact: true })).join('\n            ');

  const empty = all.length === 0 ? emptyStateHTML(locale, {
    title: t.emptySeriesTitle,
    text: t.emptySeriesText,
    cta: `<a class="btn btn--primary" href="${esc(data.site.social.find((s) => s.network === 'instagram')?.url ?? '')}" rel="noopener" target="_blank">${esc(t.followInstagram)}</a>`,
  }) : '';

  return `
<div class="wrap" style="padding-top:24px">
  ${breadcrumb(locale, [...baseTrail(locale), { label }])}
</div>
<section class="section section--crema">
  <div class="wrap">
    <span class="tricolore" aria-hidden="true"><i></i><i></i><i></i></span>
    <h1 style="margin-top:16px">${esc(label)}</h1>
    <p class="u-lead" style="max-width:var(--measure)">${esc(seriesDescription(seriesId, locale))}</p>

    ${upcoming.length ? `<h2 style="margin-top:48px">${esc(t.whenUpcoming)}</h2>
    <div class="grid grid--3" style="margin-top:24px">
      ${upcomingCards}
    </div>` : ''}

    ${past.length ? `<h2 style="margin-top:64px">${esc(t.archiveTitle)}</h2>
    <div class="grid grid--3" style="margin-top:24px">
      ${pastCards}
    </div>` : ''}

    ${empty}
  </div>
</section>`;
}

export default {
  id: 'event-series',
  async build() {
    for (const locale of LOCALES) {
      for (const [seriesId, routeId] of Object.entries(SERIES_ROUTE_ID)) {
        const alternates = routes.get(routeId);
        if (!alternates) throw new Error(`No route for series ${routeId}`);
        const navItem = data.nav.primary.find((i) => i.id === 'events').children.find((c) => c.id === routeId);
        const label = navItem ? navItem.label[locale] : seriesLabel(seriesId, locale);
        const body = seriesBody(locale, routeId, seriesId);
        writePage(alternates[locale], renderPage({
          locale,
          alternates,
          activeNav: 'events',
          title: `${esc(label)} — ${data.site.org.legalName}`,
          description: seriesDescription(seriesId, locale),
          breadcrumb: [
            { label: T[locale].home, href: routeOf('home', locale) },
            { label: data.nav.primary.find((i) => i.id === 'events').label[locale], href: routeOf('events', locale) },
            { label, href: alternates[locale] },
          ],
          body,
        }));
      }
    }
  },
};
