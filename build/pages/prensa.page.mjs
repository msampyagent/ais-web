/**
 * Prensa / Stampa — /es/prensa/ and /it/stampa/.
 *
 * No artboard covers this page. It is built as an honest empty state — the
 * brief documents no press coverage of AIS to list (01-audit.md notes the
 * association's institutional credibility exists only as small print
 * inside a poster image, never as a citable article) — using the
 * `.empty` component already defined for exactly this situation, plus a
 * small, factual media-kit block. Every sentence is new copy, flagged as
 * unvalidated in IMPLEMENTATION-LOG.md.
 *
 * nav.json's footer label for this route is "Prensa / Dicono di noi" /
 * "Stampa / Dicono di noi" — a bilingual subtitle that would mix Italian
 * into an `<html lang="es">` H1 (or vice versa) without its own `lang`
 * span. The on-page H1/title here use the single-language short form
 * ("Prensa" / "Stampa") instead; the footer link itself is untouched and
 * still renders nav.json's exact string. See IMPLEMENTATION-LOG.md.
 */
import { data, routeOf, routes, renderPage, writePage, esc, LOCALES, ui } from '../build.mjs';

const LABEL = { es: 'Prensa', it: 'Stampa' };

const DESCRIPTION = {
  es: 'Recursos para prensa sobre la Asociación Italiani a Siviglia: datos básicos de la entidad, contacto y logo para descargar.',
  it: "Risorse per la stampa sull'Associazione Italiani a Siviglia: dati di base dell'ente, contatti e logo da scaricare.",
};

const LEAD = {
  es: 'Recortes, menciones y datos básicos para periodistas y medios.',
  it: 'Rassegna, citazioni e dati di base per giornalisti e media.',
};

const EMPTY_TITLE = {
  es: 'Todavía no hay recortes de prensa que mostrar',
  it: 'Non ci sono ancora rassegne stampa da mostrare',
};
const EMPTY_TEXT = {
  es: 'Si eres periodista y quieres hablar con la asociación, o si has visto una mención que deberíamos enlazar aquí, escríbenos.',
  it: 'Se sei giornalista e vuoi parlare con l\u2019associazione, o hai visto una menzione che dovremmo linkare qui, scrivici.',
};
const WRITE_US = { es: 'Escribirnos', it: 'Scrivici' };

const PRESS_KIT_TITLE = { es: 'Datos para prensa', it: 'Dati per la stampa' };
const DOWNLOAD_LOGO = { es: 'Descargar el logo (PNG)', it: 'Scarica il logo (PNG)' };

export default {
  id: 'press',
  async build() {
    for (const locale of LOCALES) {
      const alternates = routes.get('press');
      const t = ui[locale];
      const org = data.site.org;

      const links = {
        home: routeOf('home', locale),
        contact: routeOf('contact', locale),
      };

      const body = `
<section class="section section--crema">
  <div class="wrap">
    <nav class="breadcrumb" aria-label="${esc(t.breadcrumbLabel)}">
      <ol>
        <li><a href="${links.home}">${esc(t.home)}</a></li>
        <li aria-current="page">${esc(LABEL[locale])}</li>
      </ol>
    </nav>
    <span class="tricolore" aria-hidden="true"><i></i><i></i><i></i></span>
    <h1>${esc(LABEL[locale])}</h1>
    <p class="u-lead">${esc(LEAD[locale])}</p>

    <div class="empty" style="margin-top:40px">
      <img class="empty__mark" src="/assets/img/giralda.png" alt="" width="72" height="72" loading="lazy" decoding="async">
      <p class="empty__title">${esc(EMPTY_TITLE[locale])}</p>
      <p class="empty__text">${esc(EMPTY_TEXT[locale])}</p>
      <a class="btn btn--primary" href="${links.contact}">${esc(WRITE_US[locale])}</a>
    </div>
  </div>
</section>

<section class="section section--avorio">
  <div class="wrap">
    <h2>${esc(PRESS_KIT_TITLE[locale])}</h2>
    <div class="prose">
      <ul>
        <li>${esc(org.legalName)} (${esc(org.shortName)})</li>
        <li>${esc(org.foundedLabel[locale])}</li>
        <li>Email: <a href="mailto:${esc(org.email)}">${esc(org.email)}</a></li>
        <li><a href="/assets/img/ais-logo.png" download>${esc(DOWNLOAD_LOGO[locale])}</a></li>
      </ul>
    </div>
  </div>
</section>`;

      writePage(alternates[locale], renderPage({
        locale,
        alternates,
        activeNav: null,
        title: `${LABEL[locale]} — ${org.legalName}`,
        description: DESCRIPTION[locale],
        breadcrumb: [
          { label: t.home, href: links.home },
          { label: LABEL[locale], href: alternates[locale] },
        ],
        body,
      }));
    }
  },
};
