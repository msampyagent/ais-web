/**
 * Historia / Storia — /es/asociacion/historia/ and /it/associazione/storia/.
 *
 * No artboard covers this page, so the prose below is new copy — flagged
 * as unvalidated in IMPLEMENTATION-LOG.md. Every fact is grounded in
 * ais-brief/data/site.json (founding date) and 01-audit.md §4 (recurring
 * programming, the Feria de Italia and its institutional backers, the
 * 2009–2024 blog archive). No specific edition number, attendance figure
 * or date is invented: the audit's "IX edition" is tied to when the audit
 * was written and would go stale, so it is deliberately left out here.
 */
import { data, routeOf, routes, renderPage, writePage, esc, LOCALES, ui } from '../../build.mjs';

const LABEL = { es: 'Historia', it: 'Storia' };
const ABOUT_LABEL = { es: 'La Asociación', it: "L'Associazione" };
const ARCHIVE_LABEL = { es: 'Archivo histórico 2009-2024', it: 'Archivio storico 2009-2024' };

const DESCRIPTION = {
  es: 'Quince años de actividad de la Asociación Italiani a Siviglia: la fundación en 2010, la Feria de Italia y la programación estable de la comunidad italiana en Sevilla.',
  it: "Quindici anni di attività dell'Associazione Italiani a Siviglia: la fondazione nel 2010, la Feria de Italia e la programmazione stabile della comunità italiana a Siviglia.",
};

const LEAD = {
  es: 'Quince años de vida asociativa, contados en hechos concretos.',
  it: 'Quindici anni di vita associativa, raccontati in fatti concreti.',
};

export default {
  id: 'history',
  async build() {
    for (const locale of LOCALES) {
      const alternates = routes.get('history');
      const t = ui[locale];
      const org = data.site.org;
      const blog = data.site.social.find((s) => s.network === 'blog');

      const links = {
        home: routeOf('home', locale),
        about: routeOf('about', locale),
      };

      const body = locale === 'es' ? bodyEs(org, blog, links, t) : bodyIt(org, blog, links, t);

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

function bodyEs(org, blog, links, t) {
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
      <h2>La fundación</h2>
      <p>${esc(org.legalName)} nació en Sevilla como punto de encuentro para la comunidad italiana de la ciudad. ${esc(org.foundedLabel.es)}</p>

      <h2>Quince años de programación</h2>
      <p>Desde entonces, la actividad no se ha detenido: encuentros literarios, AIS Bambini, cineforo, cursos de cocina, excursiones, aperitivos y concursos de fotografía forman la programación habitual de la asociación.</p>

      <h2>La Feria de Italia</h2>
      <p>La Feria de Italia es el evento más visible de la asociación: dos días de programación abierta y gratuita, organizados junto al Ayuntamiento de Sevilla y avalados por el Consolato Generale d'Italia a Madrid y por Com.It.Es.</p>

      <h2>El archivo</h2>
      <p>Los primeros años de actividad, con más detalle, siguen accesibles en el archivo del blog histórico.</p>
      <p><a href="${esc(blog.url)}" rel="noopener" target="_blank">${esc(ARCHIVE_LABEL.es)} ↗</a></p>
    </div>
  </div>
</section>`;
}

function bodyIt(org, blog, links, t) {
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
      <h2>La fondazione</h2>
      <p>${esc(org.legalName)} è nata a Siviglia come punto d'incontro per la comunità italiana della città. ${esc(org.foundedLabel.it)}</p>

      <h2>Quindici anni di programmazione</h2>
      <p>Da allora l'attività non si è mai fermata: incontri letterari, AIS Bambini, cineforum, corsi di cucina, escursioni, aperitivi e concorsi fotografici compongono la programmazione abituale dell'associazione.</p>

      <h2>La Feria de Italia</h2>
      <p>La Feria de Italia è l'evento più visibile dell'associazione: due giorni di programmazione aperta e gratuita, organizzati insieme all'Ayuntamiento de Sevilla e patrocinati dal Consolato Generale d'Italia a Madrid e da Com.It.Es.</p>

      <h2>L'archivio</h2>
      <p>I primi anni di attività, con maggiore dettaglio, restano consultabili nell'archivio del blog storico.</p>
      <p><a href="${esc(blog.url)}" rel="noopener" target="_blank">${esc(ARCHIVE_LABEL.it)} ↗</a></p>
    </div>
  </div>
</section>`;
}
