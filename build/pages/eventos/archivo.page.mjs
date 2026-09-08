/**
 * Eventos pasados / Archivio — lists every past event.
 */
import { data, routeOf, routes, renderPage, writePage, esc, LOCALES } from '../../build.mjs';
import { T, pastEvents, eventCardHTML, breadcrumb, baseTrail, emptyStateHTML } from './index.page.mjs';

export default {
  id: 'archive',
  async build() {
    for (const locale of LOCALES) {
      const t = T[locale];
      const alternates = routes.get('archive');
      const past = pastEvents();
      const cards = past.map((ev) => eventCardHTML(ev, locale, { compact: true })).join('\n          ');
      const empty = past.length === 0 ? emptyStateHTML(locale, { title: t.emptyFilterTitle, text: t.emptyFilterText }) : '';

      const body = `
<div class="wrap" style="padding-top:24px">
  ${breadcrumb(locale, [...baseTrail(locale), { label: t.archiveTitle }])}
</div>
<section class="section section--crema">
  <div class="wrap">
    <span class="tricolore" aria-hidden="true"><i></i><i></i><i></i></span>
    <h1 style="margin-top:16px">${esc(t.archiveTitle)}</h1>
    <p class="u-lead" style="max-width:var(--measure)">${esc(t.archiveLead)}</p>
    ${past.length ? `<div class="grid grid--3" style="margin-top:32px">${cards}</div>` : `<div style="margin-top:40px">${empty}</div>`}
  </div>
</section>`;

      writePage(alternates[locale], renderPage({
        locale,
        alternates,
        activeNav: 'events',
        title: `${t.archiveTitle} — ${data.site.org.legalName}`,
        description: t.archiveLead,
        breadcrumb: [
          { label: t.home, href: routeOf('home', locale) },
          { label: data.nav.primary.find((i) => i.id === 'events').label[locale], href: routeOf('events', locale) },
          { label: t.archiveTitle, href: alternates[locale] },
        ],
        body,
      }));
    }
  },
};
