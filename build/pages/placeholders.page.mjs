/**
 * Placeholder pages for nav.json routes that have no real page module yet.
 *
 * Rule: never ship a 404 in the navigation. Every route the footer or the
 * dropdowns link to must resolve to a page. These are deliberately thin —
 * one heading and a contact line — and they are emitted with
 * `noindex, nofollow` and kept out of the sitemap, so they cannot compete
 * with real content in the index. When a real page module is built for one
 * of these ids, remove it from PLACEHOLDER_ROUTES.
 *
 * Copy note: the body text below is NEW copy, not artboard-verbatim — it is
 * flagged here per the content-integrity rule and needs sign-off.
 */
import { data, routes, routeOf, renderPage, writePage, esc, LOCALES, ui } from '../build.mjs';

const PLACEHOLDER_ROUTES = [
  'careers',
  'become-partner',
  'volunteer',
  'sponsor',
  'newsletter',
  'faq',
  'directory',
  'gallery',
  'accessibility',
];

// NEW copy — unvalidated, flagged for review.
const TEXT = {
  es: 'Estamos preparando esta página. Mientras tanto, puedes escribirnos y te contamos más.',
  it: 'Stiamo preparando questa pagina. Nel frattempo puoi scriverci e ti raccontiamo di più.',
};
const CTA = {
  es: 'Escríbenos',
  it: 'Scrivici',
};

function navLabel(id, locale) {
  const stack = [...data.nav.primary, ...data.nav.footer.flatMap((c) => c.items)];
  while (stack.length) {
    const it = stack.pop();
    if (it.id === id) return it.label[locale];
    if (it.children) stack.push(...it.children);
  }
  return id;
}

export default {
  id: 'placeholders',
  async build() {
    for (const routeId of PLACEHOLDER_ROUTES) {
      const alternates = routes.get(routeId);
      if (!alternates) continue;
      for (const locale of LOCALES) {
        const label = navLabel(routeId, locale);
        const t = ui[locale];
        const body = `
<section class="section section--crema">
  <div class="wrap">
    <nav class="breadcrumb" aria-label="${esc(t.breadcrumbLabel)}">
      <ol>
        <li><a href="${routeOf('home', locale)}">${esc(t.home)}</a></li>
        <li aria-current="page">${esc(label)}</li>
      </ol>
    </nav>
    <span class="tricolore" aria-hidden="true"><i></i><i></i><i></i></span>
    <h1 style="margin-top:16px">${esc(label)}</h1>
    <p class="u-lead" style="max-width:var(--measure)">${esc(TEXT[locale])}</p>
    <p style="margin-top:24px"><a class="btn btn--primary" href="mailto:${esc(data.site.org.email)}">${esc(CTA[locale])}</a></p>
  </div>
</section>`;
        writePage(alternates[locale], renderPage({
          locale,
          alternates,
          title: `${label} — ${data.site.org.legalName}`,
          description: TEXT[locale],
          noindex: true,
          body,
        }));
      }
    }
  },
};
