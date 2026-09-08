/**
 * Cookie consent banner.
 *
 * Refusal by default: #cookie-banner (_partials/cookie-banner.html) ships
 * `hidden`, and this file is the only thing that ever removes that
 * attribute — and only when no choice has been stored yet. Nothing is
 * measured, tracked, or fetched from a third party as a side effect of
 * loading this script; it only records the visitor's decision once made.
 *
 * Contract for any future script that wants to load a tracker, embed, or
 * other third-party request: check `window.aisConsent.get() === 'accepted'`
 * first, or listen for the `ais:cookie-consent` document event and inspect
 * `event.detail.consent`. This file grants nothing by itself — it only
 * records the choice and exposes it for others to check.
 *
 * "Reject" and "Accept" persist a decision the same way and both dismiss
 * the banner the same way; this file must not treat one as more correct
 * than the other, and must not touch either button's styling.
 */

const STORAGE_KEY = 'ais:cookie-consent';

const readConsent = () => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

const writeConsent = (value) => {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Private browsing / storage disabled: the banner will simply be
    // re-asked next load, which is the safe, refuse-by-default failure.
  }
};

const banner = document.getElementById('cookie-banner');

const showBanner = () => { if (banner) banner.hidden = false; };
const hideBanner = () => { if (banner) banner.hidden = true; };

const setConsent = (value) => {
  writeConsent(value);
  hideBanner();
  document.dispatchEvent(new CustomEvent('ais:cookie-consent', { detail: { consent: value } }));
};

if (banner) {
  if (!readConsent()) showBanner();

  banner.querySelectorAll('[data-cookie]').forEach((btn) => {
    const action = btn.getAttribute('data-cookie');
    if (action === 'accept') btn.addEventListener('click', () => setConsent('accepted'));
    if (action === 'reject') btn.addEventListener('click', () => setConsent('rejected'));
  });
}

// Optional re-entry point: any page — the cookies policy page uses this —
// can offer a "change your choice" control with data-cookie-manage.
// Clicking it just re-shows the banner; the previous decision stands
// (refusal-by-default is unaffected) until one of its buttons is pressed
// again.
document.addEventListener('click', (e) => {
  if (e.target.closest && e.target.closest('[data-cookie-manage]')) showBanner();
});

/** Read-only check other scripts can make before loading anything. */
window.aisConsent = { get: readConsent };
