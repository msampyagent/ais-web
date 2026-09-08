/**
 * Header behaviour: scroll compression, hover/keyboard dropdowns, and the
 * mobile sheet (open/close, focus trap, Escape, body scroll lock).
 *
 * Loaded with type="module" on every generated page (build/build.mjs,
 * renderPage()), so everything here has to tolerate running on a page that
 * has no dropdowns — or, in principle, no header — without throwing.
 *
 * Motion: every transition this file touches (header height, chevron
 * rotation, dropdown/sheet visibility) is driven by CSS custom properties
 * (--dur, --ease) that assets/css/tokens.css already zeroes under
 * `prefers-reduced-motion: reduce`. This file never runs its own animation
 * loop and never smooth-scrolls anything, so that CSS rule is sufficient —
 * nothing below needs to branch on the media query.
 */

/* ---------------------------------------------------------------------
 * Scroll compression — 72px resting, 60px past the first scroll tick.
 * ------------------------------------------------------------------- */

const header = document.getElementById('site-header');

if (header) {
  const COMPRESS_AT = 4; // px — avoids flicker at the very top on rubber-band scroll

  let ticking = false;
  const applyScrollState = () => {
    header.classList.toggle('is-scrolled', window.scrollY > COMPRESS_AT);
    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(applyScrollState);
  };

  applyScrollState(); // correct state on load, e.g. a bfcache restore mid-scroll
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------------------------------------------------------------------
 * Dropdowns — open on hover and on keyboard focus, close on Escape, on
 * blur out of the group, or on an outside click. Triggers are real links
 * (build.mjs renderNavPrimary sets aria-controls="dropdown-<id>"), and
 * each panel is rendered as a sibling of the whole nav bar, not nested
 * under its trigger (renderDropdowns) — so open/close state is tracked
 * per trigger/panel pair rather than relying on DOM containment.
 * ------------------------------------------------------------------- */

const triggers = Array.from(document.querySelectorAll('.nav-primary__link[data-dropdown]'));

if (triggers.length) {
  const CLOSE_DELAY = 150; // ms grace period so the pointer can travel from link to panel

  let closeTimer = null;
  const panelFor = (trigger) => document.getElementById(trigger.getAttribute('aria-controls'));

  const closeDropdown = (trigger) => {
    const panel = panelFor(trigger);
    trigger.setAttribute('aria-expanded', 'false');
    if (panel) panel.hidden = true;
  };

  const closeAllExcept = (except) => {
    triggers.forEach((t) => { if (t !== except) closeDropdown(t); });
  };

  const openDropdown = (trigger) => {
    clearTimeout(closeTimer);
    closeAllExcept(trigger);
    const panel = panelFor(trigger);
    trigger.setAttribute('aria-expanded', 'true');
    if (panel) panel.hidden = false;
  };

  const scheduleClose = (trigger) => {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => closeDropdown(trigger), CLOSE_DELAY);
  };

  const cancelScheduledClose = () => clearTimeout(closeTimer);

  triggers.forEach((trigger) => {
    const panel = panelFor(trigger);

    trigger.addEventListener('mouseenter', () => openDropdown(trigger));
    trigger.addEventListener('mouseleave', () => scheduleClose(trigger));
    trigger.addEventListener('focus', () => openDropdown(trigger));

    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && trigger.getAttribute('aria-expanded') === 'true') {
        closeDropdown(trigger);
        trigger.focus();
        return;
      }
      // ArrowDown steps from the trigger into its panel, mirroring the
      // native menubar pattern.
      if (e.key === 'ArrowDown' && panel) {
        const first = panel.querySelector('a, button');
        if (first) {
          e.preventDefault();
          openDropdown(trigger);
          first.focus();
        }
      }
    });

    if (!panel) return;

    panel.addEventListener('mouseenter', cancelScheduledClose);
    panel.addEventListener('mouseleave', () => scheduleClose(trigger));

    panel.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeDropdown(trigger);
        trigger.focus();
      }
    });

    // Close once focus leaves both the trigger and its panel entirely —
    // e.g. Tab out of the last panel item into whatever nav link is next.
    const onGroupFocusOut = (e) => {
      const next = e.relatedTarget;
      if (!next || (next !== trigger && !panel.contains(next))) {
        closeDropdown(trigger);
      }
    };
    trigger.addEventListener('focusout', onGroupFocusOut);
    panel.addEventListener('focusout', onGroupFocusOut);
  });

  // Outside click — covers touch devices, which fire click without a prior
  // hover/focus sequence.
  document.addEventListener('click', (e) => {
    triggers.forEach((trigger) => {
      if (trigger.getAttribute('aria-expanded') !== 'true') return;
      const panel = panelFor(trigger);
      if (trigger.contains(e.target) || (panel && panel.contains(e.target))) return;
      closeDropdown(trigger);
    });
  });
}

/* ---------------------------------------------------------------------
 * Mobile sheet — open/close, per-group disclosures, focus trap, Escape,
 * body scroll lock.
 * ------------------------------------------------------------------- */

const mobileMenu = document.getElementById('mobile-menu');
const openBtn = document.querySelector('[data-mobile-open]');
const closeBtn = document.querySelector('[data-mobile-close]');

if (mobileMenu && openBtn && closeBtn) {
  const FOCUSABLE = 'a[href], button:not([disabled])';
  let lastFocused = null;

  const getFocusable = () =>
    Array.from(mobileMenu.querySelectorAll(FOCUSABLE)).filter((el) => el.offsetParent !== null);

  const trapFocus = (e) => {
    if (e.key !== 'Tab') return;
    const focusable = getFocusable();
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const onKeydown = (e) => {
    if (e.key === 'Escape') closeMobileMenu();
    else trapFocus(e);
  };

  function lockBodyScroll() {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }

  function unlockBodyScroll() {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }

  function openMobileMenu() {
    lastFocused = document.activeElement;
    mobileMenu.hidden = false;
    openBtn.setAttribute('aria-expanded', 'true');
    lockBodyScroll();
    document.addEventListener('keydown', onKeydown);
    closeBtn.focus();
  }

  function closeMobileMenu() {
    mobileMenu.hidden = true;
    openBtn.setAttribute('aria-expanded', 'false');
    unlockBodyScroll();
    document.removeEventListener('keydown', onKeydown);
    (lastFocused && document.contains(lastFocused) ? lastFocused : openBtn).focus();
  }

  openBtn.addEventListener('click', openMobileMenu);
  closeBtn.addEventListener('click', closeMobileMenu);

  // A resize past the desktop breakpoint (components.css switches the
  // burger in at max-width: 1023px) must not strand the sheet open behind
  // a now-visible desktop nav.
  const desktopQuery = window.matchMedia('(min-width: 1024px)');
  const onBreakpointChange = (e) => {
    if (e.matches && !mobileMenu.hidden) closeMobileMenu();
  };
  if (desktopQuery.addEventListener) desktopQuery.addEventListener('change', onBreakpointChange);
  else desktopQuery.addListener(onBreakpointChange); // Safari < 14

  // Per-group accordions inside the sheet (items with children render a
  // <button aria-expanded aria-controls="m-<id>">; leaf items render a
  // plain <a> with the same "mobile-menu__trigger" class but no
  // aria-controls, so this selector already skips them).
  mobileMenu.querySelectorAll('.mobile-menu__trigger[aria-controls]').forEach((trigger) => {
    const sub = document.getElementById(trigger.getAttribute('aria-controls'));
    if (!sub) return;
    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!isOpen));
      sub.hidden = isOpen;
    });
  });
}
