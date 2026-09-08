/**
 * Language switcher enhancement.
 *
 * The href on every [data-lang-link] element (the top-bar ES/IT switch and
 * the mobile sheet's language toggle) is already the twin page's URL — it
 * is computed server-side, per page, from the route registry
 * (build/build.mjs: routes, renderLangSwitch/renderLangToggle), which is
 * precisely why it lands on the equivalent page rather than the home page.
 * This file does not recompute, intercept, or preventDefault() that
 * navigation — it only remembers the visitor's explicit choice for later.
 *
 * That memory is scoped tightly on purpose: it exists so a *future* visit
 * to the un-prefixed root ("/") could prefer it over Accept-Language
 * sniffing, and it must never be used to override a URL the visitor is
 * already, explicitly, on. In practice this script never reads the value
 * back to redirect anyone — the generated root redirect (docs/index.html)
 * is written directly by build.mjs's writeRootRedirect(), outside the page
 * shell, so it never loads this file. That gap is noted in
 * SEO-REPORT.md for the team; it is not something this file can close
 * without touching build.mjs, which is out of scope here.
 */

const STORAGE_KEY = 'ais:lang';

const rememberChoice = (locale) => {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // Private browsing / storage disabled. The element is a plain
    // <a href>, so navigation to the twin page still works either way.
  }
};

document.querySelectorAll('[data-lang-link]').forEach((link) => {
  link.addEventListener('click', () => {
    const locale = link.getAttribute('data-lang-link');
    if (locale) rememberChoice(locale);
  });
});
