/**
 * Quiénes somos / Chi siamo — /es/asociacion/quienes-somos/ and
 * /it/associazione/chi-siamo/.
 *
 * No artboard covers this page (only Home and Equipo were exported in this
 * batch), so the prose below is new copy written for this build — flagged
 * as unvalidated in IMPLEMENTATION-LOG.md. Facts are grounded in
 * ais-brief/data/site.json and 01-audit.md (founding date, mission,
 * institutional partners, membership benefits); nothing beyond those
 * sources is invented. The tagline and elevator pitch are reused verbatim
 * from site.json — same wording as the home page, not rewritten. The
 * membership fee (site.json membership.priceEurYear) is a TODO_ placeholder
 * and is rendered verbatim on purpose.
 */
import { data, routeOf, routes, renderPage, writePage, esc, LOCALES, ui } from '../../build.mjs';

const LABEL = { es: 'Quiénes somos', it: 'Chi siamo' };
const ABOUT_LABEL = { es: 'La Asociación', it: "L'Associazione" };
const JOIN_LABEL = { es: 'Hazte socio', it: 'Associati' };
const TEAM_LINK_TEXT = { es: 'Conoce a la junta directiva', it: 'Scopri il direttivo' };

const DESCRIPTION = {
  es: 'Qué es la Asociación Italiani a Siviglia, desde cuándo existe, cómo se organiza y qué encuentras si te haces socio.',
  it: "Cos'è l'Associazione Italiani a Siviglia, da quando esiste, come si organizza e cosa trovi se ti associ.",
};

export default {
  id: 'who',
  async build() {
    for (const locale of LOCALES) {
      const alternates = routes.get('who');
      const t = ui[locale];
      const org = data.site.org;
      const membership = data.site.membership;

      const links = {
        home: routeOf('home', locale),
        about: routeOf('about', locale),
        team: routeOf('team', locale),
        join: routeOf('join', locale),
      };

      const institutionsList = data.site.institutions.map((inst) =>
        `<li><strong>${esc(inst.name)}</strong> — ${esc(inst.role[locale])}</li>`
      ).join('\n          ');

      const benefitsList = membership.benefits[locale].map((b) => `<li>${esc(b)}</li>`).join('\n          ');

      const body = locale === 'es'
        ? bodyEs(org, membership, institutionsList, benefitsList, t, links)
        : bodyIt(org, membership, institutionsList, benefitsList, t, links);

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

function bodyEs(org, membership, institutionsList, benefitsList, t, links) {
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
    <p class="u-lead">${esc(data.site.tagline.es)}</p>

    <div class="prose">
      <h2>Qué es AIS</h2>
      <p>${esc(data.site.elevatorPitch.es)}</p>
      <p>${esc(org.legalName)} nació en Sevilla como punto de encuentro para la comunidad italiana de la ciudad. ${esc(org.foundedLabel.es)}</p>

      <h2>Cómo nos organizamos</h2>
      <p>Es una asociación sin ánimo de lucro. La junta directiva son seis personas elegidas por la asamblea de socios, todas voluntarias. <a href="${links.team}">${esc(TEAM_LINK_TEXT.es)}</a>.</p>

      <h2>Con quién colaboramos</h2>
      <p>La actividad de la asociación, y en particular la Feria de Italia, cuenta con el respaldo de estas instituciones:</p>
      <ul>
          ${institutionsList}
      </ul>

      <h2>Cómo hacerte socio</h2>
      <p>Ser socio da acceso a lo siguiente:</p>
      <ul class="list-giralda">
          ${benefitsList}
      </ul>
      <p>Cuota anual: ${esc(membership.priceEurYear)}.</p>
      <p><a class="btn btn--primary" href="${links.join}">${esc(JOIN_LABEL.es)}</a></p>
    </div>
  </div>
</section>`;
}

function bodyIt(org, membership, institutionsList, benefitsList, t, links) {
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
    <p class="u-lead">${esc(data.site.tagline.it)}</p>

    <div class="prose">
      <h2>Cosa fa AIS</h2>
      <p>${esc(data.site.elevatorPitch.it)}</p>
      <p>${esc(org.legalName)} è nata a Siviglia come punto d'incontro per la comunità italiana della città. ${esc(org.foundedLabel.it)}</p>

      <h2>Come siamo organizzati</h2>
      <p>È un'associazione senza scopo di lucro. Il direttivo è composto da sei persone elette dall'assemblea dei soci, tutte volontarie. <a href="${links.team}">${esc(TEAM_LINK_TEXT.it)}</a>.</p>

      <h2>Con chi collaboriamo</h2>
      <p>L'attività dell'associazione, e in particolare la Feria de Italia, ha l'appoggio di queste istituzioni:</p>
      <ul>
          ${institutionsList}
      </ul>

      <h2>Come diventare socio</h2>
      <p>Essere socio dà accesso a quanto segue:</p>
      <ul class="list-giralda">
          ${benefitsList}
      </ul>
      <p>Quota annuale: ${esc(membership.priceEurYear)}.</p>
      <p><a class="btn btn--primary" href="${links.join}">${esc(JOIN_LABEL.it)}</a></p>
    </div>
  </div>
</section>`;
}
