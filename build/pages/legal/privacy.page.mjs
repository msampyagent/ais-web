/**
 * Privacy policy — /es/legal/privacidad and /it/legale/privacy.
 *
 * The artboards do not cover the legal pages (build/pages/README.md, rule
 * 5), so every sentence of prose below is new copy written for this build.
 * It is flagged as unvalidated legal text in IMPLEMENTATION-LOG.md — a
 * human with legal competence must review it before launch. The
 * TODO_ placeholders from ais-brief/data/site.json (taxId, registryNumber,
 * address) are rendered verbatim on purpose: never replace a TODO_ with a
 * plausible-looking value (README rule 6 / AGENTS.md 4.1).
 */
import { data, routeOf, routes, renderPage, writePage, esc, LOCALES, ui } from '../../build.mjs';

const LABEL = { es: 'Política de privacidad', it: 'Informativa privacy' };

const DESCRIPTION = {
  es: 'Qué datos personales trata la Asociación Italiani a Siviglia, con qué finalidad, durante cuánto tiempo y cómo ejercer tus derechos de acceso, rectificación o supresión.',
  it: 'Quali dati personali tratta l’Associazione Italiani a Siviglia, con quale finalità, per quanto tempo e come esercitare i tuoi diritti di accesso, rettifica o cancellazione.',
};

export default {
  id: 'privacy',
  async build() {
    for (const locale of LOCALES) {
      const alternates = routes.get('privacy');
      const t = ui[locale];
      const org = data.site.org;

      const body = locale === 'es' ? bodyEs(org) : bodyIt(org);

      writePage(alternates[locale], renderPage({
        locale,
        alternates,
        activeNav: null,
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

function bodyEs(org) {
  return `
<section class="section section--crema">
  <div class="wrap">
    <nav class="breadcrumb" aria-label="Ruta de navegación">
      <ol>
        <li><a href="${routeOf('home', 'es')}">Inicio</a></li>
        <li aria-current="page">Política de privacidad</li>
      </ol>
    </nav>
    <span class="tricolore" aria-hidden="true"><i></i><i></i><i></i></span>
    <h1>Política de privacidad</h1>
    <p class="u-lead">Cómo tratamos tus datos personales cuando visitas esta web, te pones en contacto con nosotros o te haces socio.</p>

    <div class="prose">
      <h2>1. Responsable del tratamiento</h2>
      <ul>
        <li>Titular: ${esc(org.legalName)} (${esc(org.shortName)})</li>
        <li>Domicilio: ${esc(org.address.street)}, ${esc(org.address.postalCode)} ${esc(org.address.locality)}</li>
        <li>NIF/CIF: ${esc(org.taxId)}</li>
        <li>Registro: Registro de Asociaciones de Andalucía, número ${esc(org.registryNumber)}</li>
        <li>Contacto: <a href="mailto:${esc(org.email)}">${esc(org.email)}</a></li>
      </ul>

      <h2>2. Qué datos tratamos y con qué finalidad</h2>
      <ul>
        <li><strong>Formulario de contacto:</strong> nombre, email y mensaje, para responder a tu consulta.</li>
        <li><strong>Hazte socio:</strong> nombre, apellidos, email, teléfono, año de llegada a Sevilla, ciudad o región de origen e intereses, para gestionar tu alta como socio.</li>
        <li><strong>Hazte partner:</strong> datos del negocio y de la persona de contacto, para gestionar tu propuesta de convenio y publicar tu ficha si se aprueba.</li>
        <li><strong>Newsletter:</strong> tu email, solo si te suscribes voluntariamente y de forma separada al resto de consentimientos.</li>
        <li><strong>Navegación:</strong> tu preferencia de idioma y tu elección sobre este aviso de cookies, guardadas en tu propio navegador — ver la <a href="${routeOf('cookies', 'es')}">Política de cookies</a>.</li>
      </ul>

      <h2>3. Base legal</h2>
      <p>El consentimiento que nos das al enviar cada formulario (art. 6.1.a RGPD) y, en el caso de quienes ya son socios, la propia relación asociativa (art. 6.1.b y 6.1.f RGPD).</p>

      <h2>4. Conservación</h2>
      <p>Conservamos tus datos mientras dure la finalidad para la que los diste. Las propuestas de convenio no formalizadas se conservan un máximo de 12 meses. Puedes pedir la supresión de tus datos en cualquier momento.</p>

      <h2>5. Destinatarios</h2>
      <p>No vendemos ni cedemos tus datos a terceros con fines comerciales. Podemos compartir los estrictamente necesarios con proveedores que nos prestan un servicio (envío de email, alojamiento web), que actúan como encargados del tratamiento bajo contrato.</p>

      <h2>6. Tus derechos</h2>
      <p>Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a <a href="mailto:${esc(org.email)}">${esc(org.email)}</a>. Si no quedas satisfecho con nuestra respuesta, puedes reclamar ante la <a href="https://www.aepd.es" rel="noopener" target="_blank">Agencia Española de Protección de Datos</a>.</p>

      <h2>7. Menores de edad</h2>
      <p>Los formularios de esta web no están dirigidos a menores de 14 años.</p>

      <h2>8. Cambios en esta política</h2>
      <p>Podemos actualizar este texto para reflejar cambios legales o en el propio sitio. Cualquier cambio relevante se publicará en esta misma página.</p>
    </div>
  </div>
</section>`;
}

function bodyIt(org) {
  return `
<section class="section section--crema">
  <div class="wrap">
    <nav class="breadcrumb" aria-label="Percorso di navigazione">
      <ol>
        <li><a href="${routeOf('home', 'it')}">Home</a></li>
        <li aria-current="page">Informativa privacy</li>
      </ol>
    </nav>
    <span class="tricolore" aria-hidden="true"><i></i><i></i><i></i></span>
    <h1>Informativa privacy</h1>
    <p class="u-lead">Come trattiamo i tuoi dati personali quando visiti questo sito, ci contatti o ti associ.</p>

    <div class="prose">
      <h2>1. Titolare del trattamento</h2>
      <ul>
        <li>Titolare: ${esc(org.legalName)} (${esc(org.shortName)})</li>
        <li>Sede: ${esc(org.address.street)}, ${esc(org.address.postalCode)} ${esc(org.address.locality)}</li>
        <li>CIF/NIF: ${esc(org.taxId)}</li>
        <li>Registro: Registro de Asociaciones de Andalucía, numero ${esc(org.registryNumber)}</li>
        <li>Contatto: <a href="mailto:${esc(org.email)}">${esc(org.email)}</a></li>
      </ul>

      <h2>2. Quali dati trattiamo e per quale finalità</h2>
      <ul>
        <li><strong>Modulo di contatto:</strong> nome, email e messaggio, per rispondere alla tua richiesta.</li>
        <li><strong>Associati:</strong> nome, cognome, email, telefono, anno di arrivo a Siviglia, città o regione di provenienza e interessi, per gestire la tua iscrizione come socio.</li>
        <li><strong>Diventa partner:</strong> dati dell'attività e della persona di contatto, per gestire la tua proposta di convenzione e pubblicare la tua scheda se approvata.</li>
        <li><strong>Newsletter:</strong> la tua email, solo se ti iscrivi volontariamente e con un consenso separato dagli altri.</li>
        <li><strong>Navigazione:</strong> la tua preferenza di lingua e la scelta fatta sull'avviso cookie, salvate nel tuo browser — vedi la <a href="${routeOf('cookies', 'it')}">Cookie policy</a>.</li>
      </ul>

      <h2>3. Base giuridica</h2>
      <p>Il consenso che ci dai inviando ogni modulo (art. 6.1.a GDPR) e, per chi è già socio, il rapporto associativo stesso (art. 6.1.b e 6.1.f GDPR).</p>

      <h2>4. Conservazione</h2>
      <p>Conserviamo i tuoi dati per il tempo necessario alla finalità per cui li hai forniti. Le proposte di convenzione non formalizzate si conservano per un massimo di 12 mesi. Puoi chiedere la cancellazione dei tuoi dati in qualsiasi momento.</p>

      <h2>5. Destinatari</h2>
      <p>Non vendiamo né cediamo i tuoi dati a terzi per finalità commerciali. Possiamo condividere il minimo indispensabile con fornitori di servizi (invio email, hosting), che agiscono come responsabili del trattamento sulla base di un contratto.</p>

      <h2>6. I tuoi diritti</h2>
      <p>Puoi esercitare i diritti di accesso, rettifica, cancellazione, opposizione, limitazione e portabilità scrivendo a <a href="mailto:${esc(org.email)}">${esc(org.email)}</a>. Se la nostra risposta non ti soddisfa, puoi presentare reclamo alla <a href="https://www.aepd.es" rel="noopener" target="_blank">Agencia Española de Protección de Datos</a>, l'autorità di controllo competente in Spagna.</p>

      <h2>7. Minori</h2>
      <p>I moduli di questo sito non sono rivolti a minori di 14 anni.</p>

      <h2>8. Modifiche a questa informativa</h2>
      <p>Possiamo aggiornare questo testo per riflettere cambiamenti normativi o del sito stesso. Ogni modifica rilevante sarà pubblicata in questa stessa pagina.</p>
    </div>
  </div>
</section>`;
}
