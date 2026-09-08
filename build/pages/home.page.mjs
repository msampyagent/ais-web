/**
 * Home — /es/ and /it/.
 *
 * PHASE 0 SKELETON. Proves the shell renders in both locales; Agent A owns
 * filling in the nine sections from AIS Home.dc.html.
 */
import { data, routes, routeOf, renderPage, writePage, esc, LOCALES } from '../build.mjs';

export default {
  id: 'home',
  async build() {
    for (const locale of LOCALES) {
      const alternates = routes.get('home');
      const body = `
<section class="section section--crema">
  <div class="wrap">
    <span class="tricolore" aria-hidden="true"><i></i><i></i><i></i></span>
    <h1 class="u-display">${esc(data.site.tagline[locale])}</h1>
    <p class="u-lead">${esc(data.site.elevatorPitch[locale])}</p>
    <p><a class="btn btn--primary" href="${routeOf('join', locale)}">${esc(
        data.nav.primary.find((i) => i.id === 'join').label[locale]
      )}</a></p>
  </div>
</section>`;

      writePage(alternates[locale], renderPage({
        locale,
        alternates,
        activeNav: null,
        title: `${data.site.org.legalName} — ${data.site.tagline[locale]}`,
        description: data.site.elevatorPitch[locale],
        body,
      }));
    }
  },
};
