/**
 * Hazte socio / Associati — /es/hazte-socio/ and /it/associati/.
 *
 * Lead form that opens the visitor's mail client with a pre-filled
 * membership enquiry. No backend is wired yet; the plain mailto action
 * makes the page submittable without JavaScript.
 */
import { data, routeOf, routes, renderPage, writePage, esc, LOCALES, ui } from '../build.mjs';

const LABEL = { es: 'Hazte socio', it: 'Associati' };
const LEAD = {
  es: 'Rellena tus datos y te enviaremos por email los pasos para formar parte de AIS.',
  it: 'Compila i tuoi dati e ti invieremo via email i passaggi per entrare a far parte di AIS.',
};
const DESCRIPTION = {
  es: 'Formulario para asociarse a la Asociación Italiani a Siviglia. Eventos, ventajas y comunidad italiana en Sevilla.',
  it: 'Modulo per associarsi all’Associazione Italiani a Siviglia. Eventi, vantaggi e comunità italiana a Siviglia.',
};
const REQUIRED = { es: 'Todos los campos son obligatorios, salvo los marcados como opcionales.', it: 'Tutti i campi sono obbligatori, tranne quelli contrassegnati come facoltativi.' };
const INTERESTS = {
  es: ['Eventos', 'AIS Bambini', 'Cocina', 'Excursiones', 'Cultura', 'Voluntariado'],
  it: ['Eventi', 'AIS Bambini', 'Cucina', 'Escursioni', 'Cultura', 'Volontariato'],
};
const INTEREST_VALUES = ['eventi', 'bambini', 'cucina', 'escursioni', 'cultura', 'volontariato'];
const NEWSLETTER = { es: 'Quiero recibir la newsletter de socios.', it: 'Voglio ricevere la newsletter dei soci.' };
const PRIVACY = { es: 'He leído y acepto la política de privacidad.', it: 'Ho letto e accetto l’informativa privacy.' };
const CHECK = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>`;

function field(name, label, type = 'text', required = true, attrs = '') {
  const req = required ? ' required' : '';
  return `
        <div class="field">
          <label class="field__label" for="${name}">${esc(label)}</label>
          <input class="input" type="${type}" id="${name}" name="${name}"${req}${attrs}>
        </div>`;
}

export default {
  id: 'join',
  async build() {
    for (const locale of LOCALES) {
      const t = ui[locale];
      const alternates = routes.get('join');
      const subject = encodeURIComponent(locale === 'es' ? 'Solicitud de socio' : 'Richiesta di associazione');
      const action = `mailto:${esc(data.site.org.email)}?subject=${subject}`;

      const interestCheckboxes = INTERESTS[locale].map((label, i) => `
        <label class="check">
          <input type="checkbox" name="intereses" value="${esc(INTEREST_VALUES[i])}">
          <span class="check__box">${CHECK}</span>
          <span class="check__text">${esc(label)}</span>
        </label>`).join('\n          ');

      const consentLabel = PRIVACY[locale].replace(
        locale === 'es' ? 'política de privacidad' : 'informativa privacy',
        `<a href="${routeOf('privacy', locale)}">${esc(locale === 'es' ? 'política de privacidad' : 'informativa privacy')}</a>`
      );

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
    <h1 style="margin-top:16px">${esc(LABEL[locale])}</h1>
    <p class="u-lead" style="max-width:var(--measure)">${esc(LEAD[locale])}</p>

    <form action="${action}" method="post" enctype="text/plain" style="display:flex;flex-direction:column;gap:20px;max-width:var(--measure);margin-top:40px">
      <p class="field__hint">${esc(REQUIRED[locale])}</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
        ${field('nombre', locale === 'es' ? 'Nombre' : 'Nome')}
        ${field('apellidos', locale === 'es' ? 'Apellidos' : 'Cognome')}
      </div>
      ${field('email', 'Email', 'email')}
      ${field('telefono', locale === 'es' ? 'Teléfono' : 'Telefono', 'tel', false)}
      ${field('llegada', locale === 'es' ? 'Año de llegada a Sevilla' : 'Anno di arrivo a Siviglia', 'number', false, ' min="1900" max="2100"')}
      ${field('origen', locale === 'es' ? 'Ciudad o región de origen en Italia' : 'Città o regione di origine in Italia', 'text', false)}
      <fieldset style="border:0;padding:0;margin:0">
        <legend class="field__label">${esc(locale === 'es' ? 'Intereses' : 'Interessi')}</legend>
        <div style="display:flex;flex-direction:column;gap:12px">
          ${interestCheckboxes}
        </div>
      </fieldset>
      <label class="check">
        <input type="checkbox" name="newsletter" value="1">
        <span class="check__box">${CHECK}</span>
        <span class="check__text">${esc(NEWSLETTER[locale])}</span>
      </label>
      <label class="check">
        <input type="checkbox" name="consent" value="1" required>
        <span class="check__box">${CHECK}</span>
        <span class="check__text">${consentLabel}</span>
      </label>
      <p><button class="btn btn--primary" type="submit">${esc(LABEL[locale])}</button></p>
    </form>
  </div>
</section>`;

      writePage(alternates[locale], renderPage({
        locale,
        alternates,
        activeNav: 'join',
        title: `${LABEL[locale]} — ${data.site.org.legalName}`,
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
