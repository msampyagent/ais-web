/**
 * Noticias / Notizie — /es/noticias/ and /it/notizie/.
 *
 * Lists published news from ais-brief/data/news.json. Long-form content is
 * intentionally minimal because the data schema only stores a summary; the
 * full body is a TODO placeholder.
 */
import { data, routeOf, routes, renderPage, writePage, esc, LOCALES, ui } from '../build.mjs';

const LABEL = { es: 'Noticias', it: 'Notizie' };
const LEAD = {
  es: 'Anuncios y recapitulaciones de la Asociación Italiani a Siviglia.',
  it: 'Annunci e riepiloghi dell’Associazione Italiani a Siviglia.',
};
const EMPTY_TITLE = { es: 'Todavía no hay noticias', it: 'Non ci sono ancora notizie' };
const EMPTY_TEXT = {
  es: 'Vuelve pronto o síguenos en Instagram.',
  it: 'Torna presto o seguici su Instagram.',
};

function categoryLabel(id, locale) {
  const c = data.news.categories.find((x) => x.id === id);
  return c ? c.label[locale] : id;
}

export default {
  id: 'news',
  async build() {
    for (const locale of LOCALES) {
      const t = ui[locale];
      const alternates = routes.get('news');
      const items = data.news.items.filter((n) => n.status === 'published');

      const cards = items.map((n) => `
        <article class="card">
          <div class="card__body">
            <div class="u-small" style="text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">${esc(categoryLabel(n.category, locale))} · ${esc(n.date)}</div>
            <h2 class="card__title">${esc(n.title[locale])}</h2>
            <p>${esc(n.summary[locale])}</p>
          </div>
        </article>`).join('\n          ');

      const empty = `
        <div class="empty" style="margin-top:40px">
          <img class="empty__mark" src="/assets/img/giralda.png" alt="" width="72" height="72" loading="lazy" decoding="async">
          <p class="empty__title">${esc(EMPTY_TITLE[locale])}</p>
          <p class="empty__text">${esc(EMPTY_TEXT[locale])}</p>
        </div>`;

      const body = `
<section class="section section--crema">
  <div class="wrap">
    <nav class="breadcrumb" aria-label="${esc(t.breadcrumbLabel)}">
      <ol>
        <li><a href="${routeOf('home', locale)}">${esc(t.home)}</a></li>
        <li aria-current="page">${esc(LABEL[locale])}</li>
      </ol>
    </nav>
    <span class="tricolore" aria-hidden="true"><i></i><i></i><i></i></span>
    <h1 style="margin-top:16px">${esc(LABEL[locale])}</h1>
    <p class="u-lead" style="max-width:var(--measure)">${esc(LEAD[locale])}</p>

    ${items.length ? `<div class="grid grid--2" style="margin-top:40px">${cards}</div>` : empty}
  </div>
</section>`;

      writePage(alternates[locale], renderPage({
        locale,
        alternates,
        activeNav: 'news',
        title: `${LABEL[locale]} — ${data.site.org.legalName}`,
        description: LEAD[locale],
        breadcrumb: [
          { label: t.home, href: routeOf('home', locale) },
          { label: LABEL[locale], href: alternates[locale] },
        ],
        body,
      }));
    }
  },
};
