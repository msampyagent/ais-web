/**
 * Legal notice — /es/legal/aviso-legal and /it/legale/note-legali.
 *
 * This is "Aviso legal" (LSSI-CE site-identification notice), not "Términos
 * y condiciones" — 02-information-architecture.md §1 explicitly removed
 * that label as the wrong term for an association. New copy (README rule
 * 5), flagged as unvalidated in IMPLEMENTATION-LOG.md. TODO_ placeholders
 * from site.json are rendered verbatim — never replace one with a
 * plausible-looking value.
 */
import { data, routeOf, routes, renderPage, writePage, esc, LOCALES, ui } from '../../build.mjs';

const LABEL = { es: 'Aviso legal', it: 'Note legali' };

const DESCRIPTION = {
  es: 'Datos identificativos de la Asociación Italiani a Siviglia, condiciones de uso de esta web, propiedad intelectual y legislación aplicable.',
  it: 'Dati identificativi dell’Associazione Italiani a Siviglia, condizioni d’uso di questo sito, proprietà intellettuale e legge applicabile.',
};

export default {
  id: 'terms',
  async build() {
    for (const locale of LOCALES) {
      const alternates = routes.get('terms');
      const t = ui[locale];
      const org = data.site.org;

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
        body: locale === 'es' ? bodyEs(org) : bodyIt(org),
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
        <li aria-current="page">Aviso legal</li>
      </ol>
    </nav>
    <span class="tricolore" aria-hidden="true"><i></i><i></i><i></i></span>
    <h1>Aviso legal</h1>
    <p class="u-lead">Datos identificativos, condiciones de uso y responsabilidad de este sitio web.</p>

    <div class="prose">
      <h2>1. Datos identificativos</h2>
      <p>En cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE):</p>
      <ul>
        <li>Titular: ${esc(org.legalName)} (${esc(org.shortName)})</li>
        <li>Domicilio: ${esc(org.address.street)}, ${esc(org.address.postalCode)} ${esc(org.address.locality)}</li>
        <li>NIF/CIF: ${esc(org.taxId)}</li>
        <li>Registro: Registro de Asociaciones de Andalucía, número ${esc(org.registryNumber)}</li>
        <li>Contacto: <a href="mailto:${esc(org.email)}">${esc(org.email)}</a></li>
      </ul>

      <h2>2. Objeto</h2>
      <p>Este sitio informa sobre la actividad de la asociación: eventos, ventajas para socios, guía práctica para italianos en Sevilla y vías para hacerse socio, colaborar o proponer un convenio.</p>

      <h2>3. Condiciones de uso</h2>
      <p>El acceso a este sitio es gratuito y no exige suscripción. El uso del sitio implica la aceptación de este aviso legal. Nos comprometemos a no pedirte más datos de los necesarios para cada gestión.</p>

      <h2>4. Propiedad intelectual</h2>
      <p>Los textos, imágenes y el diseño de este sitio son de ${esc(org.legalName)} o se usan con autorización de sus autores. Puedes citarlos o enlazarlos indicando la fuente; reproducirlos de forma completa requiere nuestro permiso previo, salvo el logo y los materiales de prensa que se indiquen expresamente como de uso libre.</p>

      <h2>5. Enlaces a terceros</h2>
      <p>Este sitio enlaza a organismos, socios y medios que no dependen de nosotros (Ayuntamiento de Sevilla, Consulado General de Italia, Com.It.Es., Eventbrite, redes sociales…). No respondemos del contenido de esos sitios.</p>

      <h2>6. Responsabilidad</h2>
      <p>Procuramos que la información esté actualizada y sea correcta, pero puede contener errores o quedar desactualizada; <a href="mailto:${esc(org.email)}">escríbenos</a> si detectas alguno. No garantizamos la disponibilidad continua del sitio.</p>

      <h2>7. Legislación aplicable</h2>
      <p>Este aviso se rige por la legislación española. Para cualquier controversia relacionada con este sitio serán competentes los juzgados y tribunales que resulten legalmente competentes conforme a la normativa aplicable.</p>
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
        <li aria-current="page">Note legali</li>
      </ol>
    </nav>
    <span class="tricolore" aria-hidden="true"><i></i><i></i><i></i></span>
    <h1>Note legali</h1>
    <p class="u-lead">Dati identificativi, condizioni d'uso e responsabilità di questo sito web.</p>

    <div class="prose">
      <h2>1. Dati identificativi</h2>
      <p>In conformità all'articolo 10 della Ley 34/2002 spagnola sui servizi della società dell'informazione e il commercio elettronico (LSSI-CE):</p>
      <ul>
        <li>Titolare: ${esc(org.legalName)} (${esc(org.shortName)})</li>
        <li>Sede: ${esc(org.address.street)}, ${esc(org.address.postalCode)} ${esc(org.address.locality)}</li>
        <li>CIF/NIF: ${esc(org.taxId)}</li>
        <li>Registro: Registro de Asociaciones de Andalucía, numero ${esc(org.registryNumber)}</li>
        <li>Contatto: <a href="mailto:${esc(org.email)}">${esc(org.email)}</a></li>
      </ul>

      <h2>2. Oggetto</h2>
      <p>Questo sito informa sull'attività dell'associazione: eventi, vantaggi per i soci, guida pratica per gli italiani a Siviglia e modi per associarsi, collaborare o proporre una convenzione.</p>

      <h2>3. Condizioni d'uso</h2>
      <p>L'accesso a questo sito è gratuito e non richiede iscrizione. L'uso del sito implica l'accettazione di queste note legali. Ci impegniamo a non chiederti più dati di quelli necessari per ogni pratica.</p>

      <h2>4. Proprietà intellettuale</h2>
      <p>I testi, le immagini e il design di questo sito appartengono a ${esc(org.legalName)} o sono utilizzati con l'autorizzazione dei rispettivi autori. Puoi citarli o condividerne il link indicando la fonte; riprodurli per intero richiede il nostro permesso preventivo, salvo il logo e i materiali stampa espressamente indicati come di libero uso.</p>

      <h2>5. Link a terzi</h2>
      <p>Questo sito rimanda a enti, partner e media che non dipendono da noi (Comune di Siviglia, Consolato Generale d'Italia, Com.It.Es., Eventbrite, social media…). Non rispondiamo del contenuto di quei siti.</p>

      <h2>6. Responsabilità</h2>
      <p>Cerchiamo di mantenere le informazioni aggiornate e corrette, ma possono contenere errori o risultare non aggiornate; <a href="mailto:${esc(org.email)}">scrivici</a> se ne trovi uno. Non garantiamo la disponibilità continua del sito.</p>

      <h2>7. Legge applicabile</h2>
      <p>Queste note legali sono regolate dalla legge spagnola. Per qualsiasi controversia relativa a questo sito saranno competenti i giudici e i tribunali legalmente competenti secondo la normativa applicabile.</p>
    </div>
  </div>
</section>`;
}
