/**
 * La Asociación / L'Associazione — /es/asociacion/ and /it/associazione/.
 *
 * Short landing page for the "La Asociación" section: a one-screen overview
 * that links onward to Quiénes somos, Equipo, Historia and Estatutos. No
 * artboard covers this exact landing screen (only the Home and Equipo
 * screens were exported in this batch), so every sentence below is new
 * copy written in the same dry register as the rest of the site — flagged
 * as unvalidated in IMPLEMENTATION-LOG.md. The four link cards reuse the
 * section labels verbatim from nav.json.
 */
import { data, routeOf, routes, renderPage, writePage, esc, LOCALES, ui } from '../../build.mjs';

const LABEL = { es: 'La Asociación', it: "L'Associazione" };

const DESCRIPTION = {
  es: 'Quiénes somos, quién forma la junta directiva, la historia de la asociación desde 2010 y los estatutos que nos rigen.',
  it: "Chi siamo, chi compone il direttivo, la storia dell'associazione dal 2010 e lo statuto che ci governa.",
};

const LEAD = {
  es: 'Quiénes somos, cómo nos organizamos y qué hemos hecho desde 2010 — todo en una sola página.',
  it: 'Chi siamo, come siamo organizzati e cosa abbiamo fatto dal 2010 — tutto in un\u2019unica pagina.',
};

// Verbatim from nav.json (data.nav.primary → id "about" → children).
const CARDS = [
  {
    id: 'who',
    label: { es: 'Quiénes somos', it: 'Chi siamo' },
    text: {
      es: 'Qué es la asociación y a quién representa.',
      it: "Cosa fa l'associazione e chi rappresenta.",
    },
  },
  {
    id: 'team',
    label: { es: 'Equipo', it: 'Direttivo' },
    text: {
      es: 'Las seis personas de la junta directiva, elegidas en asamblea.',
      it: 'Le sei persone del direttivo, elette in assemblea.',
    },
  },
  {
    id: 'history',
    label: { es: 'Historia', it: 'Storia' },
    text: {
      es: 'Quince años de actividad, desde la fundación en 2010.',
      it: 'Quindici anni di attività, dalla fondazione nel 2010.',
    },
  },
  {
    id: 'statute',
    label: { es: 'Estatutos y transparencia', it: 'Statuto e trasparenza' },
    text: {
      es: 'Cómo nos organizamos y dónde consultar los datos de registro.',
      it: 'Come siamo organizzati e dove consultare i dati di registrazione.',
    },
  },
];

const INSTITUTIONS_LABEL = { es: 'Con el aval de', it: 'Con il patrocinio di' };

export default {
  id: 'about',
  async build() {
    for (const locale of LOCALES) {
      const alternates = routes.get('about');
      const t = ui[locale];
      const org = data.site.org;

      const cards = CARDS.map((c) => `
      <a class="card" href="${routeOf(c.id, locale)}">
        <div class="card__body">
          <h2 class="card__title">${esc(c.label[locale])}</h2>
          <p>${esc(c.text[locale])}</p>
        </div>
      </a>`).join('\n');

      const institutions = data.site.institutions.map((inst) =>
        `<a href="${esc(inst.url)}" rel="noopener" target="_blank" title="${esc(inst.role[locale])}">${esc(inst.name)}</a>`
      ).join('\n        ');

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
    <h1>${esc(LABEL[locale])}</h1>
    <p class="u-lead">${esc(LEAD[locale])}</p>

    <div class="grid grid--2" style="margin-top:40px">
      ${cards}
    </div>
  </div>
</section>

<section class="section section--avorio">
  <div class="wrap">
    <p class="u-label u-label--siena">${esc(INSTITUTIONS_LABEL[locale])}</p>
    <div class="institutions" style="margin-top:16px">
      ${institutions}
    </div>
    <p class="u-small" style="margin-top:24px">${esc(org.foundedLabel[locale])}</p>
  </div>
</section>`;

      writePage(alternates[locale], renderPage({
        locale,
        alternates,
        activeNav: 'about',
        title: `${LABEL[locale]} — ${org.legalName}`,
        description: DESCRIPTION[locale],
        breadcrumb: [
          { label: t.home, href: routeOf('home', locale) },
          { label: LABEL[locale], href: alternates[locale] },
        ],
        body,
      }));
    }
  },
};
