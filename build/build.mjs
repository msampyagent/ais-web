#!/usr/bin/env node
/**
 * AIS static site generator.
 *
 * Node standard library only — no dependencies, no bundler. Run with:
 *   node build/build.mjs
 *
 * What it owns:
 *   - the route registry, derived from nav.json, so every page knows its own
 *     URL and its twin in the other language;
 *   - the page shell: <head>, header, footer, cookie banner;
 *   - hreflang, canonical and Open Graph, generated from the registry so
 *     reciprocity is structural rather than something to remember;
 *   - sitemap.xml and robots.txt.
 *
 * What page modules own: their own <main>, their title/description, and any
 * page-specific JSON-LD. See build/pages/README.md.
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, cpSync, rmSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DATA = join(ROOT, 'ais-brief', 'data');
const PARTIALS = join(ROOT, '_partials');
const PAGES = join(__dirname, 'pages');

/* ---------------------------------------------------------------------------
 * Site constants
 * ------------------------------------------------------------------------- */

/** Production origin. Change here only — everything else derives from it. */
export const ORIGIN = process.env.ORIGIN ?? 'https://italianiasiviglia.com';

/**
 * Sub-path the site is served from, without a trailing slash.
 *
 * Empty for production (custom domain, served at the root). A GitHub Pages
 * *project* site serves at https://<user>.github.io/<repo>/, so a preview
 * build needs BASE_PATH=/ais-web or every absolute /assets/... 404s.
 *
 *   BASE_PATH=/ais-web node build/build.mjs
 */
export const BASE_PATH = (process.env.BASE_PATH ?? '').replace(/\/$/, '');

/** A preview build must never compete with production in the index. */
export const IS_PREVIEW = BASE_PATH !== '' || process.env.PREVIEW === '1';

/** Where generated HTML lands. docs/ is what GitHub Pages can serve directly. */
const OUT = join(ROOT, process.env.OUT_DIR ?? 'docs');

export const LOCALES = ['es', 'it'];
export const DEFAULT_LOCALE = 'es';

const OG_LOCALE = { es: 'es_ES', it: 'it_IT' };

/* ---------------------------------------------------------------------------
 * Data
 * ------------------------------------------------------------------------- */

const readJSON = (name) => JSON.parse(readFileSync(join(DATA, name), 'utf8'));

export const data = {
  site: readJSON('site.json'),
  nav: readJSON('nav.json'),
  events: readJSON('events.json'),
  convenios: readJSON('convenios.json'),
  team: readJSON('team.json'),
  news: readJSON('news.json'),
  careers: readJSON('careers.json'),
  forms: readJSON('forms.json'),
};

/* ---------------------------------------------------------------------------
 * UI strings
 *
 * Spanish is verbatim from the artboards. Italian marked NEW is new copy
 * written for this build and still needs the board's sign-off — it is listed
 * in IMPLEMENTATION-LOG.md.
 * ------------------------------------------------------------------------- */

export const ui = {
  es: {
    skip: 'Saltar al contenido',
    navLabel: 'Navegación principal',
    menuOpen: 'Abrir el menú',
    menuClose: 'Cerrar el menú',
    brandAlt: 'Asociación Italiani a Siviglia — inicio',
    footerTagline: 'Asociación de italianos en Sevilla. Desde el 14 de febrero de 2010.',
    breadcrumbLabel: 'Ruta de navegación',
    home: 'Inicio',
    cookieTitle: 'Cookies',
    cookieText: 'Usamos cookies propias para que la web funcione y, si nos dejas, cookies de medición para saber qué páginas se leen. Ninguna publicidad. Puedes cambiarlo cuando quieras.',
    cookieReject: 'Rechazar',
    cookieAccept: 'Aceptar',
    cookiePrefs: 'Preferencias',
    langEs: 'Español',
    langIt: 'Italiano',
  },
  it: {
    skip: 'Salta al contenuto',                                  // NEW
    navLabel: 'Navigazione principale',                          // NEW
    menuOpen: 'Apri il menu',                                    // NEW
    menuClose: 'Chiudi il menu',                                 // NEW
    brandAlt: 'Associazione Italiani a Siviglia — home',
    footerTagline: 'Associazione degli italiani a Siviglia. Dal 14 febbraio 2010.',  // NEW
    breadcrumbLabel: 'Percorso di navigazione',                  // NEW
    home: 'Home',                                                // NEW
    cookieTitle: 'Cookie',                                       // NEW
    cookieText: 'Usiamo cookie tecnici perché il sito funzioni e, se ce lo permetti, cookie di misurazione per sapere quali pagine vengono lette. Nessuna pubblicità. Puoi cambiare idea quando vuoi.', // NEW
    cookieReject: 'Rifiuta',                                     // NEW
    cookieAccept: 'Accetta',                                     // NEW
    cookiePrefs: 'Preferenze',                                   // NEW
    langEs: 'Spagnolo',
    langIt: 'Italiano',
  },
};

/* ---------------------------------------------------------------------------
 * Route registry
 *
 * Built once from nav.json. Every entry carries both locales, which is what
 * makes hreflang reciprocal by construction: a page cannot declare an
 * alternate that does not declare it back, because both sides read this map.
 * ------------------------------------------------------------------------- */

/** id -> { es: '/es/...', it: '/it/...' } */
export const routes = new Map();

const urlFor = (locale, slug) => (slug ? `/${locale}/${slug}/` : `/${locale}/`);

function registerNavItem(item) {
  if (item.ref || item.external || !item.slug) return;
  if (!routes.has(item.id)) {
    routes.set(item.id, Object.fromEntries(
      LOCALES.map((l) => [l, urlFor(l, item.slug[l])])
    ));
  }
  (item.children ?? []).forEach(registerNavItem);
}

data.nav.primary.forEach(registerNavItem);
data.nav.footer.forEach((col) => col.items.forEach(registerNavItem));
(data.nav.utility?.items ?? []).forEach(registerNavItem);

// Home is not a nav entry but is a route.
routes.set('home', Object.fromEntries(LOCALES.map((l) => [l, `/${l}/`])));

/** Register a route generated by a page module (event detail, guide article…). */
export function registerRoute(id, slugs) {
  routes.set(id, Object.fromEntries(LOCALES.map((l) => [l, urlFor(l, slugs[l])])));
  return routes.get(id);
}

export const routeOf = (id, locale) => {
  const r = routes.get(id);
  if (!r) throw new Error(`Unknown route id: "${id}". Add it to nav.json or call registerRoute().`);
  return r[locale];
};

/* ---------------------------------------------------------------------------
 * Template helpers
 * ------------------------------------------------------------------------- */

const partial = (name) => readFileSync(join(PARTIALS, name), 'utf8');

const TPL = {
  head: partial('head.html'),
  header: partial('header.html'),
  footer: partial('footer.html'),
  cookie: partial('cookie-banner.html'),
};

/** Replace {{token}} placeholders. Unknown tokens are an error, not a blank. */
function fill(template, values) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in values)) throw new Error(`Template placeholder "{{${key}}}" has no value.`);
    return values[key] ?? '';
  });
}

/** Escape for HTML text and double-quoted attributes. */
export function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const CHEVRON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>`;
const CHEVRON_LG = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>`;

const SOCIAL_ICON = {
  instagram: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>`,
  facebook: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`,
};

/* ---------------------------------------------------------------------------
 * Navigation rendering
 * ------------------------------------------------------------------------- */

/** Items shown in the top bar: everything except the CTA. */
const topLevel = data.nav.primary.filter((i) => i.style !== 'cta-primary');
const ctaItem = data.nav.primary.find((i) => i.style === 'cta-primary');

function renderNavPrimary(locale, activeId) {
  return topLevel.map((item) => {
    const href = routeOf(item.id, locale);
    const hasChildren = (item.children ?? []).length > 0;
    const active = item.id === activeId ? ' is-active' : '';
    if (!hasChildren) {
      return `<a class="nav-primary__link${active}" href="${href}">${esc(item.label[locale])}</a>`;
    }
    return `<a class="nav-primary__link${active}" href="${href}" `
      + `aria-expanded="false" aria-controls="dropdown-${item.id}" data-dropdown="${item.id}">`
      + `${esc(item.label[locale])}${CHEVRON}</a>`;
  }).join('\n      ');
}

/** Dropdown panels live after the bar so they can span the full width. */
function renderDropdowns(locale) {
  return topLevel.filter((i) => (i.children ?? []).length).map((item) => {
    const kids = item.children.filter((c) => !c.sameAsParent || c.id === 'calendar');
    const half = Math.ceil(kids.length / 2);
    const col = (items) => items.map((c) => {
      const href = routeOf(c.id, locale);
      return `<a class="dropdown__item" href="${href}">`
        + `<div><span class="dropdown__item-title">${esc(c.label[locale])}</span></div></a>`;
    }).join('\n          ');
    return `<div class="dropdown" id="dropdown-${item.id}" hidden>
    <div class="dropdown__inner">
      <div class="dropdown__col">
          ${col(kids.slice(0, half))}
      </div>
      <div class="dropdown__col">
          ${col(kids.slice(half))}
      </div>
    </div>
  </div>`;
  }).join('\n  ');
}

function renderNavMobile(locale) {
  return topLevel.map((item) => {
    const href = routeOf(item.id, locale);
    const kids = item.children ?? [];
    if (!kids.length) {
      return `<div class="mobile-menu__group"><a class="mobile-menu__trigger" href="${href}">`
        + `${esc(item.label[locale])}</a></div>`;
    }
    const sub = kids.map((c) =>
      `<a href="${routeOf(c.id, locale)}">${esc(c.label[locale])}</a>`
    ).join('\n        ');
    return `<div class="mobile-menu__group">
      <button class="mobile-menu__trigger" type="button" aria-expanded="false" aria-controls="m-${item.id}">
        ${esc(item.label[locale])}${CHEVRON_LG}
      </button>
      <div class="mobile-menu__sub" id="m-${item.id}" hidden>
        ${sub}
      </div>
    </div>`;
  }).join('\n    ');
}

/**
 * Language switch. Points at the twin page, never the home page — that is
 * the whole reason the route registry exists.
 */
function renderLangSwitch(locale, alternates) {
  return LOCALES.map((l, i) => {
    const label = l.toUpperCase();
    const sep = i > 0 ? '<span class="lang-switch__sep" aria-hidden="true">·</span>\n        ' : '';
    if (l === locale) {
      return `${sep}<span aria-current="true" lang="${l}">${label}</span>`;
    }
    return `${sep}<a href="${alternates[l]}" lang="${l}" hreflang="${l}" data-lang-link="${l}">${label}</a>`;
  }).join('\n        ');
}

function renderLangToggle(locale, alternates) {
  return LOCALES.map((l) => {
    const label = l === 'es' ? ui[locale].langEs : ui[locale].langIt;
    if (l === locale) return `<a href="${alternates[l]}" aria-current="true" lang="${l}">${esc(label)}</a>`;
    return `<a href="${alternates[l]}" lang="${l}" hreflang="${l}" data-lang-link="${l}">${esc(label)}</a>`;
  }).join('\n        ');
}

function renderSocialIcons() {
  return data.site.social
    .filter((s) => SOCIAL_ICON[s.network])
    .map((s) => `<a href="${s.url}" rel="me noopener" target="_blank">`
      + `<span class="visually-hidden">${esc(s.handle)}</span>${SOCIAL_ICON[s.network]}</a>`)
    .join('\n        ');
}

/** Resolve a footer item, following {ref: id} back into the primary nav. */
function resolveFooterItem(item, locale) {
  if (item.external) return { label: item.label[locale], href: item.external, external: true };
  if (item.ref) {
    const found = findNavItem(item.ref);
    return { label: found.label[locale], href: routeOf(item.ref, locale) };
  }
  return { label: item.label[locale], href: routeOf(item.id, locale) };
}

function findNavItem(id) {
  const stack = [...data.nav.primary, ...data.nav.footer.flatMap((c) => c.items)];
  while (stack.length) {
    const it = stack.pop();
    if (it.id === id) return it;
    if (it.children) stack.push(...it.children);
  }
  throw new Error(`nav.json has a {ref:"${id}"} pointing at nothing.`);
}

function renderFooterCols(locale) {
  return data.nav.footer.map((col) => {
    const links = col.items.map((item) => {
      const { label, href, external } = resolveFooterItem(item, locale);
      const strong = item.id === 'become-partner' ? ' class="is-strong"' : '';
      const attrs = external ? ' rel="noopener" target="_blank"' : '';
      return `<a href="${href}"${strong}${attrs}>${esc(label)}</a>`;
    }).join('\n          ');
    return `<div>
        <p class="site-footer__heading">${esc(col.column[locale])}</p>
        <div class="site-footer__list">
          ${links}
        </div>
      </div>`;
  }).join('\n      ');
}

function renderInstitutions(locale) {
  return data.site.institutions.map((inst) =>
    `<a href="${inst.url}" rel="noopener" target="_blank" title="${esc(inst.role[locale])}">${esc(inst.name)}</a>`
  ).join('\n        ');
}

/* ---------------------------------------------------------------------------
 * SEO block
 * ------------------------------------------------------------------------- */

function renderHreflang(alternates) {
  const lines = LOCALES.map((l) =>
    `<link rel="alternate" hreflang="${l}" href="${ORIGIN}${alternates[l]}">`
  );
  lines.push(`<link rel="alternate" hreflang="x-default" href="${ORIGIN}${alternates[DEFAULT_LOCALE]}">`);
  return lines.join('\n');
}

/** Organization JSON-LD — on every page, per the IA document. */
export function organizationLd(locale) {
  const { org, social, tagline } = data.site;
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: org.legalName,
    alternateName: org.shortName,
    url: `${ORIGIN}/${locale}/`,
    email: org.email,
    foundingDate: org.foundedISO,
    description: tagline[locale],
    logo: `${ORIGIN}/assets/img/ais-logo.png`,
    areaServed: { '@type': 'City', name: org.city },
    sameAs: social.map((s) => s.url),
  };
}

export function breadcrumbLd(locale, trail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.label,
      item: `${ORIGIN}${t.href}`,
    })),
  };
}

const ldScript = (obj) =>
  `<script type="application/ld+json">${JSON.stringify(obj, null, 0)}</script>`;

/* ---------------------------------------------------------------------------
 * Page shell
 * ------------------------------------------------------------------------- */

/**
 * @param {object} page
 * @param {string} page.locale
 * @param {object} page.alternates  { es: '/es/...', it: '/it/...' }
 * @param {string} page.title
 * @param {string} page.description
 * @param {string} page.body        the <main> contents
 * @param {string} [page.activeNav] top-level nav id to mark active
 * @param {object[]} [page.jsonld]  extra JSON-LD objects
 * @param {string} [page.ogType]
 * @param {string} [page.ogImage]
 * @param {Array}  [page.breadcrumb] [{label, href}]
 */
export function renderPage(page) {
  const { locale, alternates } = page;
  const t = ui[locale];
  const canonical = `${ORIGIN}${alternates[locale]}`;
  const other = LOCALES.find((l) => l !== locale);

  const ld = [organizationLd(locale), ...(page.jsonld ?? [])];
  if (page.breadcrumb?.length) ld.push(breadcrumbLd(locale, page.breadcrumb));

  const head = fill(TPL.head, {
    title: esc(page.title),
    description: esc(page.description),
    canonical,
    hreflang: renderHreflang(alternates),
    ogType: page.ogType ?? 'website',
    siteName: data.site.org.legalName,
    ogImage: `${ORIGIN}${page.ogImage ?? '/assets/img/og-default.png'}`,
    ogLocale: OG_LOCALE[locale],
    ogLocaleAlt: `<meta property="og:locale:alternate" content="${OG_LOCALE[other]}">`,
    locale,
    jsonld: ld.map(ldScript).join('\n'),
  });

  const robotsMeta = IS_PREVIEW
    ? '<meta name="robots" content="noindex, nofollow">\n'
    : '';

  const header = fill(TPL.header, {
    homeHref: routeOf('home', locale),
    brandAlt: esc(t.brandAlt),
    navLabel: esc(t.navLabel),
    navPrimary: renderNavPrimary(locale, page.activeNav),
    dropdowns: renderDropdowns(locale),
    langSwitch: renderLangSwitch(locale, alternates),
    langToggle: renderLangToggle(locale, alternates),
    navMobile: renderNavMobile(locale),
    ctaHref: routeOf(ctaItem.id, locale),
    ctaLabel: esc(ctaItem.label[locale]),
    menuOpenLabel: esc(t.menuOpen),
    menuCloseLabel: esc(t.menuClose),
    socialIcons: renderSocialIcons(),
  });

  const footer = fill(TPL.footer, {
    brandAlt: esc(t.brandAlt),
    footerTagline: esc(t.footerTagline),
    footerCols: renderFooterCols(locale),
    institutions: renderInstitutions(locale),
    socialIcons: renderSocialIcons(),
    copyright: esc(data.nav.footerBottom.copyright[locale].replace('{year}', new Date().getFullYear())),
    email: data.site.org.email,
  });

  const cookie = fill(TPL.cookie, {
    cookieTitle: esc(t.cookieTitle),
    cookieText: esc(t.cookieText),
    cookieReject: esc(t.cookieReject),
    cookieAccept: esc(t.cookieAccept),
    cookiePrefs: esc(t.cookiePrefs),
    cookiePolicyHref: routeOf('cookies', locale),
  });

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
${robotsMeta}${head}
</head>
<body>
<a class="skip-link" href="#main">${esc(t.skip)}</a>
${header}
<main id="main">
${page.body}
</main>
${footer}
${cookie}
<script src="/assets/js/header.js" type="module"></script>
<script src="/assets/js/lang.js" type="module"></script>
<script src="/assets/js/cookies.js" type="module"></script>
${(page.scripts ?? []).map((s) => `<script src="${s}" type="module"></script>`).join('\n')}
</body>
</html>
`;

  return withBasePath(html);
}

/**
 * Prefix every root-relative URL with BASE_PATH.
 *
 * Applied once, here, rather than asking every partial and every page module
 * to remember a {{base}} token — a page that forgets would 404 only on the
 * preview deploy, which is exactly where nobody looks. Absolute URLs
 * (canonical, hreflang, og:url) start with "https:" and are left alone: they
 * must keep pointing at production.
 */
function withBasePath(html) {
  if (!BASE_PATH) return html;
  return html.replace(/\b(href|src|action)="\/(?!\/)/g, `$1="${BASE_PATH}/`);
}

/* ---------------------------------------------------------------------------
 * Output
 * ------------------------------------------------------------------------- */

const written = [];

export function writePage(urlPath, html) {
  const out = join(OUT, urlPath.replace(/^\//, ''), 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html, 'utf8');
  written.push(urlPath);
}

/* ---------------------------------------------------------------------------
 * Page module discovery
 *
 * Every file matching build/pages/**\/*.page.mjs exports:
 *   export default { id, activeNav?, build() }
 * build() is free to call registerRoute/writePage as many times as it needs
 * (one call per event, per article, and so on).
 * ------------------------------------------------------------------------- */

function findPageModules(dir) {
  if (!safeStat(dir)) return [];
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return findPageModules(full);
    return entry.endsWith('.page.mjs') ? [full] : [];
  });
}

const safeStat = (p) => { try { return statSync(p); } catch { return null; } };

/* ---------------------------------------------------------------------------
 * Root redirect, sitemap, robots
 * ------------------------------------------------------------------------- */

function writeRootRedirect() {
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Asociación Italiani a Siviglia</title>
<link rel="canonical" href="${ORIGIN}/es/">
${LOCALES.map((l) => `<link rel="alternate" hreflang="${l}" href="${ORIGIN}/${l}/">`).join('\n')}
<link rel="alternate" hreflang="x-default" href="${ORIGIN}/es/">
<meta http-equiv="refresh" content="0; url=/es/">
<script>
  // Prefer the visitor's language when we have a page for it; the meta
  // refresh above is the no-JS fallback and always lands on Spanish.
  var l = (navigator.language || 'es').slice(0, 2);
  location.replace(l === 'it' ? '/it/' : '/es/');
</script>
</head>
<body>
<p>Redirigiendo a <a href="/es/">/es/</a> · <a href="/it/">Italiano</a></p>
</body>
</html>
`;
  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, 'index.html'), html, 'utf8');
}

function writeSitemap() {
  // One <url> per page, each carrying xhtml:link alternates for both locales.
  const groups = new Map();
  for (const p of written) {
    const id = [...routes.entries()].find(([, r]) => Object.values(r).includes(p));
    const key = id ? id[0] : p;
    if (!groups.has(key)) groups.set(key, id ? id[1] : { [p.slice(1, 3)]: p });
  }

  const urls = [...groups.values()].flatMap((alts) =>
    LOCALES.filter((l) => alts[l] && written.includes(alts[l])).map((l) => {
      const links = LOCALES
        .filter((x) => alts[x])
        .map((x) => `    <xhtml:link rel="alternate" hreflang="${x}" href="${ORIGIN}${alts[x]}"/>`)
        .join('\n');
      return `  <url>
    <loc>${ORIGIN}${alts[l]}</loc>
${links}
    <xhtml:link rel="alternate" hreflang="x-default" href="${ORIGIN}${alts[DEFAULT_LOCALE]}"/>
  </url>`;
    })
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;
  writeFileSync(join(OUT, 'sitemap.xml'), xml, 'utf8');
}

/**
 * Copy static assets into the output tree.
 *
 * GitHub Pages serves a single directory, so assets/ has to live inside it
 * rather than beside it. Source of truth stays at the repo root.
 */
function copyAssets() {
  cpSync(join(ROOT, 'assets'), join(OUT, 'assets'), { recursive: true });
}

function writeRobots() {
  // A preview build asks robots to stay out entirely.
  const body = IS_PREVIEW
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`;
  writeFileSync(join(OUT, 'robots.txt'), body, 'utf8');

  // Stop GitHub Pages running the output through Jekyll, which would drop
  // any path segment beginning with an underscore.
  writeFileSync(join(OUT, '.nojekyll'), '', 'utf8');
}

/* ---------------------------------------------------------------------------
 * Main
 * ------------------------------------------------------------------------- */

async function main() {
  // Start from a clean tree: a page removed from build/pages/ must disappear
  // from the output too, rather than lingering as an orphan Pages can serve.
  rmSync(OUT, { recursive: true, force: true });

  const modules = findPageModules(PAGES);

  if (!modules.length) {
    console.warn('No page modules found in build/pages/. Nothing to build yet.');
  }

  for (const file of modules) {
    const mod = await import(pathToFileURL(file).href);
    const page = mod.default;
    if (typeof page?.build !== 'function') {
      throw new Error(`${relative(ROOT, file)} must default-export an object with a build() function.`);
    }
    await page.build();
  }

  copyAssets();
  writeRootRedirect();
  writeSitemap();
  writeRobots();

  console.log(`Built ${written.length} pages across ${LOCALES.length} locales.`);
  for (const p of written.sort()) console.log(`  ${p}`);
}

const isMain = process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url;
if (isMain) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
