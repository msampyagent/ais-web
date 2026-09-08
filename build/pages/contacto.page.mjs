/**
 * Contacto / Contatti — /es/contacto/ and /it/contatti/.
 *
 * No artboard covers this page. The form fields, order and requiredness
 * come straight from ais-brief/data/forms.json's "contact" block — the
 * five fields there, nothing added or removed. The surrounding copy (lead,
 * section headings, submit label, "other ways to contact us") is new,
 * flagged as unvalidated in IMPLEMENTATION-LOG.md.
 *
 * The form degrades to a plain HTML POST: `action="/api/contact"
 * method="post"`, matching forms.json's `delivery.endpoint`. No JS
 * intercepts the submit — there is no backend behind that endpoint yet.
 * Per CLAUDE.md's "Known gaps", the form endpoint/provider is one of the
 * unanswered client questions; wiring an actual serverless function
 * (Resend/Brevo/Web3Forms behind Cloudflare Pages Functions, per
 * forms.json's own delivery.providers/hosting notes) is a pending client
 * decision, not something this page module can resolve.
 */
import { data, routeOf, routes, renderPage, writePage, esc, LOCALES, ui } from '../build.mjs';

const LABEL = { es: 'Contacto', it: 'Contatti' };

const DESCRIPTION = {
  es: 'Escribe a la Asociación Italiani a Siviglia: hazte socio, pregunta por un evento, propone un convenio o contacta con prensa.',
  it: "Scrivi all'Associazione Italiani a Siviglia: associati, chiedi informazioni su un evento, proponi una convenzione o contatta la stampa.",
};

const LEAD = {
  es: '¿Quieres hacerte socio, tienes una pregunta sobre un evento o eres periodista? Escríbenos y te contestamos.',
  it: 'Vuoi associarti, hai una domanda su un evento o sei giornalista? Scrivici e ti risponderemo.',
};

const FORM_TITLE = { es: 'Escríbenos', it: 'Scrivici' };
const REQUIRED_HINT = { es: 'Todos los campos son obligatorios.', it: 'Tutti i campi sono obbligatori.' };
const SUBMIT_LABEL = { es: 'Enviar mensaje', it: 'Invia messaggio' };
const PRIVACY_LINK_TEXT = { es: 'política de privacidad', it: "informativa privacy" };

const OTHER_TITLE = { es: 'Otras formas de contacto', it: 'Altri modi per contattarci' };
const OTHER_TEXT = { es: 'Solemos responder en pocos días.', it: 'Di solito rispondiamo in pochi giorni.' };

const CHECK = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>`;

function field(f, locale) {
  const req = f.required ? '<span class="req">*</span>' : '';
  const label = `<label class="field__label" for="${f.name}">${esc(f.label[locale])}${req}</label>`;

  if (f.type === 'textarea') {
    return `
        <div class="field">
          ${label}
          <textarea class="textarea" id="${f.name}" name="${f.name}" rows="${f.rows ?? 4}"${f.required ? ' required' : ''}></textarea>
        </div>`;
  }

  if (f.type === 'select') {
    const options = f.options.map((o) =>
      `<option value="${esc(o.value)}">${esc(o.label[locale])}</option>`
    ).join('\n            ');
    return `
        <div class="field">
          ${label}
          <select class="select" id="${f.name}" name="${f.name}"${f.required ? ' required' : ''}>
            ${options}
          </select>
        </div>`;
  }

  const autocomplete = f.name === 'name' ? ' autocomplete="name"' : f.name === 'email' ? ' autocomplete="email"' : '';
  return `
        <div class="field">
          ${label}
          <input class="input" type="${f.type}" id="${f.name}" name="${f.name}"${autocomplete}${f.required ? ' required' : ''}>
        </div>`;
}

export default {
  id: 'contact',
  async build() {
    for (const locale of LOCALES) {
      const alternates = routes.get('contact');
      const t = ui[locale];
      const org = data.site.org;
      const fields = data.forms.contact.fields.filter((f) => f.type !== 'checkbox');
      const consentField = data.forms.contact.fields.find((f) => f.type === 'checkbox');

      const links = {
        home: routeOf('home', locale),
        privacy: routeOf('privacy', locale),
      };

      const fieldsHTML = fields.map((f) => field(f, locale)).join('\n');

      const consentLabelRaw = esc(consentField.label[locale]);
      // Wrap the words "política de privacidad" / "informativa privacy" — a
      // substring already present in forms.json's consent label — in a link
      // to the privacy page, without altering the approved wording itself.
      const consentLabelHTML = consentLabelRaw.replace(
        esc(PRIVACY_LINK_TEXT[locale]),
        `<a href="${links.privacy}">${esc(PRIVACY_LINK_TEXT[locale])}</a>`
      );

      const social = data.site.social.filter((s) => s.primary);
      const socialHTML = social.map((s) =>
        `<a href="${esc(s.url)}" rel="me noopener" target="_blank">${esc(s.handle)}</a>`
      ).join('\n        ');

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

    <h2>${esc(FORM_TITLE[locale])}</h2>
    <p class="field__hint">${esc(REQUIRED_HINT[locale])}</p>

    <form action="/api/contact" method="post" style="display:flex;flex-direction:column;gap:20px;max-width:var(--measure)">
      ${fieldsHTML}

      <label class="check">
        <input type="checkbox" id="consent" name="consent" required>
        <span class="check__box">${CHECK}</span>
        <span class="check__text">${consentLabelHTML}</span>
      </label>

      <p><button class="btn btn--primary" type="submit">${esc(SUBMIT_LABEL[locale])}</button></p>
    </form>
  </div>
</section>

<section class="section section--avorio">
  <div class="wrap">
    <h2>${esc(OTHER_TITLE[locale])}</h2>
    <p>${esc(OTHER_TEXT[locale])}</p>
    <p><a href="mailto:${esc(org.email)}">${esc(org.email)}</a></p>
    <div class="institutions" style="margin-top:16px">
      ${socialHTML}
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
        jsonld: [{
          '@context': 'https://schema.org',
          '@type': 'ContactPoint',
          email: org.email,
          contactType: 'customer service',
          areaServed: 'ES',
          availableLanguage: ['Spanish', 'Italian'],
        }],
        body,
      }));
    }
  },
};
