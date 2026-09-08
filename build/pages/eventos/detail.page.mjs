/**
 * Individual event detail pages.
 *
 * Writes one page per listable event in events.json. Routes are already
 * registered by eventos/index.page.mjs at import time.
 */
import { data, routeOf, routes, renderPage, writePage, esc, LOCALES } from '../../build.mjs';
import { T, listableEvents, parseEventDate, detailDatesHTML, priceLine, languageTag, posterImg, sponsorPillHTML, breadcrumb, baseTrail, seriesLabel, SERIES_ROUTE } from './index.page.mjs';

function detailJsonLd(ev, locale) {
  const start = parseEventDate(ev.start);
  const end = parseEventDate(ev.end);
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: ev.title[locale],
    description: ev.summary[locale],
    inLanguage: locale,
    startDate: start.raw,
    endDate: end.raw ?? start.raw,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: ev.venue?.name,
      address: { '@type': 'PostalAddress', addressLocality: ev.venue?.locality },
    },
    organizer: { '@type': 'Organization', name: data.site.org.legalName },
    isAccessibleForFree: Boolean(ev.price?.public === 0 || ev.price?.members === 0),
  };
}

function programmeHTML(ev, locale, t) {
  if (!ev.programme?.length) return '';
  const days = [...new Set(ev.programme.map((p) => p.day))];
  const byDay = (day) => ev.programme.filter((p) => p.day === day)
    .map((p) => `<li><strong>${esc(p.time ?? '')}</strong> ${esc(p.title)}${p.by ? ` — ${esc(p.by)}` : ''}</li>`).join('\n            ');
  const daySections = days.map((day) => `
        <div>
          <p class="u-label" style="margin-bottom:10px">${esc(day)}</p>
          <ul class="list-giralda">
            ${byDay(day)}
          </ul>
        </div>`).join('');
  return `
      <h2 style="margin-top:48px">${esc(t.programTitle)}</h2>
      <div style="display:flex;flex-direction:column;gap:32px;margin-top:24px">
        ${daySections}
      </div>`;
}

function pageHTML(ev, locale) {
  const t = T[locale];
  const seriesRoute = SERIES_ROUTE[ev.series];
  const trail = [...baseTrail(locale)];
  if (seriesRoute) trail.push({ label: seriesLabel(ev.series, locale), href: routeOf(seriesRoute, locale) });
  trail.push({ label: ev.title[locale] });

  const start = parseEventDate(ev.start);
  const isPast = ev.status === 'past' || (start.date && start.date < new Date());

  const info = [
    { label: t.fechas, value: detailDatesHTML(ev, locale) },
    { label: t.donde, value: esc(ev.venue?.name ? `${ev.venue.name}, ${ev.venue.locality}` : ev.venue?.locality) },
    { label: t.idioma, value: languageTag(ev.language, locale) },
    { label: t.precio, value: priceLine(ev, locale) },
  ];

  let registerHTML = '';
  if (!isPast && ev.registration?.required) {
    if (ev.registration.type === 'eventbrite' && ev.registration.url) {
      registerHTML = `<p style="margin-top:24px"><a class="btn btn--primary" href="${esc(ev.registration.url)}" rel="noopener" target="_blank">${esc(t.registerEventbrite)}</a></p>`;
    } else if (ev.registration.email) {
      const mailto = `mailto:${esc(ev.registration.email)}?subject=${esc(ev.title[locale])}`;
      registerHTML = `<p style="margin-top:24px"><a class="btn btn--primary" href="${mailto}">${esc(t.registerEmail)}</a></p>`;
    }
  }

  const sponsors = ev.sponsors?.length ? `
      <h2 style="margin-top:48px">${esc(t.patrocinan)}</h2>
      <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:16px">
        ${ev.sponsors.map(sponsorPillHTML).join('')}
      </div>` : '';

  const endorsed = ev.endorsedBy?.length ? `
      <h2 style="margin-top:48px">${esc(t.conElAvalDe)}</h2>
      <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:16px">
        ${ev.endorsedBy.map(sponsorPillHTML).join('')}
      </div>` : '';

  const cta = isPast ? '' : `
      <div class="callout" style="margin-top:48px">
        <h2>${esc(t.joinCtaGenericTitle)}</h2>
        <p>${esc(t.joinCtaGenericText)}</p>
        <p><a class="btn btn--primary" href="${routeOf('join', locale)}">${esc(t.joinCta)}</a></p>
      </div>`;

  return `
<div class="wrap" style="padding-top:24px">
  ${breadcrumb(locale, trail)}
</div>
<section class="section section--crema">
  <div class="wrap">
    <span class="tricolore" aria-hidden="true"><i></i><i></i><i></i></span>
    <h1 style="margin-top:16px">${esc(ev.title[locale])}</h1>
    <p class="u-lead" style="max-width:var(--measure)">${esc(ev.summary[locale])}</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:start;margin-top:40px">
      <div class="card-event__media" style="border-radius:var(--r-md);overflow:hidden;background:var(--avorio)">
        ${posterImg(ev.poster, ev.title[locale], { eager: true })}
      </div>
      <div>
        <dl style="display:grid;gap:20px">
          ${info.map((i) => `<div><dt class="u-label">${esc(i.label)}</dt><dd style="margin:0">${i.value}</dd></div>`).join('')}
        </dl>
        ${registerHTML}
      </div>
    </div>

    ${programmeHTML(ev, locale, t)}
    ${sponsors}
    ${endorsed}
    ${cta}
  </div>
</section>`;
}

export default {
  id: 'event-detail',
  async build() {
    for (const locale of LOCALES) {
      for (const ev of listableEvents()) {
        const alternates = routes.get(ev.id);
        if (!alternates) continue;
        const seriesRoute = SERIES_ROUTE[ev.series];
        const bc = [...baseTrail(locale)];
        if (seriesRoute) bc.push({ label: seriesLabel(ev.series, locale), href: routeOf(seriesRoute, locale) });
        bc.push({ label: ev.title[locale], href: alternates[locale] });
        writePage(alternates[locale], renderPage({
          locale,
          alternates,
          activeNav: 'events',
          title: `${esc(ev.title[locale])} — ${data.site.org.legalName}`,
          description: ev.summary[locale],
          breadcrumb: bc,
          jsonld: [detailJsonLd(ev, locale)],
          ogImage: ev.poster,
          body: pageHTML(ev, locale),
        }));
      }
    }
  },
};
