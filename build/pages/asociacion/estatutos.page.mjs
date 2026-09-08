/**
 * Estatutos y transparencia / Statuto e trasparenza —
 * /es/asociacion/estatutos/ and /it/associazione/statuto/.
 *
 * No artboard covers a dedicated statute page. The "Cómo se elige la
 * junta" heading and paragraph ARE quoted verbatim from the "Equipo"
 * section of 1streview/AIS Equipo y Colabora.dc.html (Spanish only; the
 * Italian translation is new, flagged in IMPLEMENTATION-LOG.md). Every
 * other sentence on this page is new copy, kept deliberately high-level:
 * no invented statute clauses beyond the election procedure the artboard
 * already approved. org.taxId, org.registryNumber and org.address are
 * TODO_ placeholders in site.json and are rendered verbatim — never
 * replaced with a plausible-looking value (AGENTS.md 4.1). The full
 * statute text is not published anywhere in the brief, so this page says
 * so honestly instead of fabricating a document.
 */
import { data, routeOf, routes, renderPage, writePage, esc, LOCALES, ui } from '../../build.mjs';

const LABEL = { es: 'Estatutos y transparencia', it: 'Statuto e trasparenza' };
const ABOUT_LABEL = { es: 'La Asociación', it: "L'Associazione" };
const TEAM_LABEL = { es: 'Ver la junta directiva actual', it: 'Vedi il direttivo attuale' };

const DESCRIPTION = {
  es: 'Cómo se organiza la Asociación Italiani a Siviglia, cómo se elige la junta directiva cada dos años y dónde consultar los datos de registro de la entidad.',
  it: "Come è organizzata l'Associazione Italiani a Siviglia, come viene eletto il direttivo ogni due anni e dove consultare i dati di registrazione dell'ente.",
};

const LEAD = {
  es: 'Cómo nos organizamos, cómo se eligen los cargos y qué datos de registro puedes consultar.',
  it: 'Come siamo organizzati, come vengono eletti gli incarichi e quali dati di registrazione puoi consultare.',
};

// Verbatim ES from the artboard; IT is a new translation.
const ELECTION_TITLE = { es: 'Cómo se elige la junta', it: 'Come si elegge il direttivo' };
const ELECTION_TEXT = {
  es: 'La asamblea de socios elige los seis cargos cada dos años, en votación abierta. Cualquier socio puede presentarse. El procedimiento está en los estatutos, artículos 12 a 17.',
  it: "L'assemblea dei soci elegge le sei cariche ogni due anni, con votazione aperta. Qualsiasi socio può candidarsi. La procedura è descritta nello statuto, articoli 12\u201317.",
};

export default {
  id: 'statute',
  async build() {
    for (const locale of LOCALES) {
      const alternates = routes.get('statute');
      const t = ui[locale];
      const org = data.site.org;
      const team = data.team;

      const links = {
        home: routeOf('home', locale),
        about: routeOf('about', locale),
        team: routeOf('team', locale),
      };

      const termLine = locale === 'es'
        ? `Mandato actual: ${esc(team.currentTerm.from)}\u2013${esc(team.currentTerm.to)} (elegido en asamblea el ${esc(team.currentTerm.electedAt)}).`
        : `Mandato attuale: ${esc(team.currentTerm.from)}\u2013${esc(team.currentTerm.to)} (eletto in assemblea il ${esc(team.currentTerm.electedAt)}).`;

      const body = locale === 'es' ? bodyEs(org, links, t, termLine) : bodyIt(org, links, t, termLine);

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

function bodyEs(org, links, t, termLine) {
  return `
<section class="section section--crema">
  <div class="wrap">
    <nav class="breadcrumb" aria-label="${esc(t.breadcrumbLabel)}">
      <ol>
        <li><a href="${links.home}">${esc(t.home)}</a></li>
        <li><a href="${links.about}">${esc(ABOUT_LABEL.es)}</a></li>
        <li aria-current="page">${esc(LABEL.es)}</li>
      </ol>
    </nav>
    <span class="tricolore" aria-hidden="true"><i></i><i></i><i></i></span>
    <h1>${esc(LABEL.es)}</h1>
    <p class="u-lead">${esc(LEAD.es)}</p>

    <div class="prose">
      <h2>Datos de la entidad</h2>
      <ul>
        <li>Nombre legal: ${esc(org.legalName)} (${esc(org.shortName)})</li>
        <li>${esc(org.foundedLabel.es)}</li>
        <li>NIF/CIF: ${esc(org.taxId)}</li>
        <li>Registro: Registro de Asociaciones de Andalucía, número ${esc(org.registryNumber)}</li>
        <li>Domicilio: ${esc(org.address.street)}, ${esc(org.address.postalCode)} ${esc(org.address.locality)}</li>
        <li>Contacto: <a href="mailto:${esc(org.email)}">${esc(org.email)}</a></li>
      </ul>

      <h2>${esc(ELECTION_TITLE.es)}</h2>
      <p>${esc(ELECTION_TEXT.es)}</p>
      <p class="u-small">${termLine}</p>
      <p><a href="${links.team}">${esc(TEAM_LABEL.es)}</a>.</p>

      <h2>Transparencia económica</h2>
      <p>La asociación no tiene ánimo de lucro. Los ingresos por cuotas de socios y patrocinios se destinan a los eventos y a la actividad ordinaria. El tesorero presenta las cuentas del ejercicio en la asamblea de socios.</p>

      <h2>El texto de los estatutos</h2>
      <p>El texto íntegro de los estatutos todavía no está publicado en este sitio. Si necesitas consultarlo, escribe a <a href="mailto:${esc(org.email)}">${esc(org.email)}</a> y te lo enviamos.</p>
    </div>
  </div>
</section>`;
}

function bodyIt(org, links, t, termLine) {
  return `
<section class="section section--crema">
  <div class="wrap">
    <nav class="breadcrumb" aria-label="${esc(t.breadcrumbLabel)}">
      <ol>
        <li><a href="${links.home}">${esc(t.home)}</a></li>
        <li><a href="${links.about}">${esc(ABOUT_LABEL.it)}</a></li>
        <li aria-current="page">${esc(LABEL.it)}</li>
      </ol>
    </nav>
    <span class="tricolore" aria-hidden="true"><i></i><i></i><i></i></span>
    <h1>${esc(LABEL.it)}</h1>
    <p class="u-lead">${esc(LEAD.it)}</p>

    <div class="prose">
      <h2>Dati dell'ente</h2>
      <ul>
        <li>Nome legale: ${esc(org.legalName)} (${esc(org.shortName)})</li>
        <li>${esc(org.foundedLabel.it)}</li>
        <li>CIF/NIF: ${esc(org.taxId)}</li>
        <li>Registro: Registro de Asociaciones de Andalucía, numero ${esc(org.registryNumber)}</li>
        <li>Sede: ${esc(org.address.street)}, ${esc(org.address.postalCode)} ${esc(org.address.locality)}</li>
        <li>Contatto: <a href="mailto:${esc(org.email)}">${esc(org.email)}</a></li>
      </ul>

      <h2>${esc(ELECTION_TITLE.it)}</h2>
      <p>${esc(ELECTION_TEXT.it)}</p>
      <p class="u-small">${termLine}</p>
      <p><a href="${links.team}">${esc(TEAM_LABEL.it)}</a>.</p>

      <h2>Trasparenza economica</h2>
      <p>L'associazione non ha scopo di lucro. Le entrate da quote sociali e sponsorizzazioni sono destinate agli eventi e all'attività ordinaria. Il tesoriere presenta i conti dell'esercizio all'assemblea dei soci.</p>

      <h2>Il testo dello statuto</h2>
      <p>Il testo integrale dello statuto non è ancora pubblicato su questo sito. Se hai bisogno di consultarlo, scrivi a <a href="mailto:${esc(org.email)}">${esc(org.email)}</a> e te lo inviamo.</p>
    </div>
  </div>
</section>`;
}
