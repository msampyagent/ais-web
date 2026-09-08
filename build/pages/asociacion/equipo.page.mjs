/**
 * Equipo / Direttivo — /es/asociacion/equipo/ and /it/associazione/direttivo/.
 *
 * Source of truth: the "Equipo" section of 1streview/AIS Equipo y
 * Colabora.dc.html (desktop only — no mobile or IT variant was exported
 * for this screen). The H1, lead paragraph and the "Cómo se elige la
 * junta" callout copy are quoted verbatim from that artboard in Spanish;
 * their Italian versions are new translations, flagged as unvalidated in
 * IMPLEMENTATION-LOG.md. The "Colabora" volunteering page itself belongs
 * to a different stream and is not built here — the volunteer teaser at
 * the bottom only links out to the already-registered "careers" route.
 *
 * team.json members are ALL placeholders right now (`_comment` in the
 * file). Every name, role bio and current-term date below is rendered
 * verbatim from that file — see AGENTS.md 4.1. A member with `photo: null`
 * renders an initials monogram, per team.json's own comment; the
 * artboard's fake sample bios and its invented "3 open positions" figure
 * are NOT reused, because we have no real data behind either.
 */
import { data, routeOf, routes, renderPage, writePage, esc, LOCALES, ui } from '../../build.mjs';

const LABEL = { es: 'Equipo', it: 'Direttivo' };
const ABOUT_LABEL = { es: 'La Asociación', it: "L'Associazione" };

// Verbatim from the artboard (ES); IT is a new translation — flagged above.
const H1 = { es: 'La junta directiva', it: 'La giunta direttiva' };
const LEAD = {
  es: 'Seis personas elegidas en asamblea, todas voluntarias. Si quieres proponer algo, escribe a cualquiera de nosotros: contestamos.',
  it: 'Sei persone elette in assemblea, tutte volontarie. Se vuoi proporre qualcosa, scrivi a chiunque di noi: rispondiamo.',
};

const DESCRIPTION = {
  es: 'La junta directiva de la Asociación Italiani a Siviglia: quiénes la forman, sus funciones y cómo se elige cada dos años en asamblea.',
  it: 'Il direttivo dell\u2019Associazione Italiani a Siviglia: chi lo compone, i suoi ruoli e come viene eletto ogni due anni in assemblea.',
};

// "Cómo se elige la junta" — verbatim ES from the artboard; IT new translation.
const ELECTION_TITLE = { es: 'Cómo se elige la junta', it: 'Come si elegge il direttivo' };
const ELECTION_TEXT = {
  es: 'La asamblea de socios elige los seis cargos cada dos años, en votación abierta. Cualquier socio puede presentarse. El procedimiento está en los estatutos, artículos 12 a 17.',
  it: "L'assemblea dei soci elegge le sei cariche ogni due anni, con votazione aperta. Qualsiasi socio può candidarsi. La procedura è descritta nello statuto, articoli 12\u201317.",
};
const STATUTE_LABEL = { es: 'Estatutos y transparencia', it: 'Statuto e trasparenza' };

// Heading verbatim from the artboard; body text is team.json's own
// volunteersNote (real JSON content, not the artboard's fake body copy).
const VOLUNTEER_TITLE = { es: 'Además de la junta, somos muchos', it: 'Oltre al direttivo, siamo tanti' };
const CAREERS_LABEL = { es: 'Colabora con nosotros', it: 'Collabora con noi' };

const ARROW = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;

function initials(name) {
  return String(name)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

function memberCard(member, locale) {
  const media = member.photo
    ? `<img src="${esc(member.photo)}" alt="${esc(member.name)}" width="600" height="600" loading="lazy" decoding="async">`
    : `<span class="card-team__monogram" aria-hidden="true">${esc(initials(member.name))}</span>`;
  return `
      <div class="card">
        <div class="card-team__media">${media}</div>
        <div class="card__body">
          <div class="card-team__role">${esc(member.role[locale])}</div>
          <h2 class="card__title">${esc(member.name)}</h2>
          <p class="u-small">${esc(member.bio[locale])}</p>
        </div>
      </div>`;
}

export default {
  id: 'team',
  async build() {
    for (const locale of LOCALES) {
      const alternates = routes.get('team');
      const t = ui[locale];
      const org = data.site.org;
      const team = data.team;

      const links = {
        home: routeOf('home', locale),
        about: routeOf('about', locale),
        statute: routeOf('statute', locale),
        careers: routeOf('careers', locale),
      };

      const members = [...team.members]
        .filter((m) => m.public)
        .sort((a, b) => a.order - b.order)
        .map((m) => memberCard(m, locale))
        .join('\n');

      const termLine = locale === 'es'
        ? `Mandato actual: ${esc(team.currentTerm.from)}\u2013${esc(team.currentTerm.to)} (elegido en asamblea el ${esc(team.currentTerm.electedAt)}).`
        : `Mandato attuale: ${esc(team.currentTerm.from)}\u2013${esc(team.currentTerm.to)} (eletto in assemblea il ${esc(team.currentTerm.electedAt)}).`;

      const body = `
<section class="section section--crema">
  <div class="wrap" style="position:relative;overflow:hidden">
    <img class="watermark" src="/assets/img/giralda.png" alt="" aria-hidden="true"
         width="420" height="420" loading="lazy" decoding="async"
         style="right:-40px;top:-80px;height:420px">
    <nav class="breadcrumb" aria-label="${esc(t.breadcrumbLabel)}">
      <ol>
        <li><a href="${links.home}">${esc(t.home)}</a></li>
        <li><a href="${links.about}">${esc(ABOUT_LABEL[locale])}</a></li>
        <li aria-current="page">${esc(LABEL[locale])}</li>
      </ol>
    </nav>
    <span class="tricolore" aria-hidden="true"><i></i><i></i><i></i></span>
    <h1 style="position:relative">${esc(H1[locale])}</h1>
    <p class="u-lead" style="position:relative">${esc(LEAD[locale])}</p>
    <p class="u-small" style="position:relative">${termLine}</p>

    <div class="grid grid--3" style="margin-top:40px;position:relative">
      ${members}
    </div>
  </div>
</section>

<section class="section section--avorio">
  <div class="wrap">
    <div class="grid grid--2">
      <div class="callout">
        <h3>${esc(ELECTION_TITLE[locale])}</h3>
        <p>${esc(ELECTION_TEXT[locale])}</p>
        <p><a href="${links.statute}" style="display:inline-flex;align-items:center;gap:8px">${esc(STATUTE_LABEL[locale])}${ARROW}</a></p>
      </div>
      <div class="callout">
        <h3>${esc(VOLUNTEER_TITLE[locale])}</h3>
        <p>${esc(team.volunteersNote[locale])}</p>
        <p><a class="btn btn--primary" href="${links.careers}">${esc(CAREERS_LABEL[locale])}</a></p>
      </div>
    </div>
  </div>
</section>`;

      writePage(alternates[locale], renderPage({
        locale,
        alternates,
        activeNav: 'about',
        title: `${LABEL[locale]} — ${org.legalName}`,
        description: DESCRIPTION[locale],
        breadcrumb: [
          { label: t.home, href: links.home },
          { label: ABOUT_LABEL[locale], href: links.about },
          { label: LABEL[locale], href: alternates[locale] },
        ],
        body,
      }));
    }
  },
};
