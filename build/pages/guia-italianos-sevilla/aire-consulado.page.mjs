/**
 * Guía práctica — AIRE y consulado.
 *
 * The one guide article 1streview/AIS Guia Practica.dc.html shows in full
 * desktop detail. Every paragraph, list item, callout and FAQ question
 * marked "verbatim" below is copied character-for-character from that
 * artboard. Two sections the artboard's own "En esta página" index promises
 * ("Cambiar de dirección", "Renovar el pasaporte") are never written out in
 * the mockup — this build adds them as new, dry, unvalidated copy so the
 * in-page index does not point at nothing. Three of the four FAQ answers
 * are also new (the artboard shows all four questions but only answers the
 * first). All Italian copy on this page is new — the artboard is ES-only.
 * See IMPLEMENTATION-LOG.md.
 */
import { data, routes, routeOf, renderPage, writePage, esc, LOCALES } from '../../build.mjs';
import { articleShell, articleJsonLd, officialLinksCallout, stepsList, documentsList } from './index.page.mjs';

const ARTICLE_ID = 'aire';

const LEAD = {
  es: 'Si te has mudado a Sevilla por más de doce meses, tienes que inscribirte en el AIRE. Aquí está el trámite explicado por quien ya lo ha hecho, sin lenguaje administrativo.', // verbatim
  it: 'Se ti sei trasferito a Siviglia da più di dodici mesi, devi iscriverti all’AIRE. Ecco la pratica spiegata da chi l’ha già fatta, senza linguaggio burocratico.', // NEW
};

const DESCRIPTION = {
  es: 'Cómo inscribirse en el AIRE desde Sevilla: el portal Fast It, los documentos que hacen falta, cómo cambiar de dirección y cómo renovar el pasaporte en el consulado.',
  it: 'Come iscriversi all’AIRE da Siviglia: il portale Fast It, i documenti necessari, come cambiare indirizzo e come rinnovare il passaporto al consolato.',
};

function consulateUrl() {
  return data.site.institutions.find((i) => i.name === "Consolato Generale d'Italia a Madrid")?.url ?? '#';
}

const SECTIONS = {
  es: [
    { id: 'que-es-el-aire', label: 'Qué es el AIRE' }, // verbatim
    { id: 'como-inscribirse', label: 'Cómo inscribirse desde Sevilla' }, // verbatim
    { id: 'documentos', label: 'Qué documentos hacen falta' }, // verbatim
    { id: 'cambiar-direccion', label: 'Cambiar de dirección' }, // NEW
    { id: 'renovar-pasaporte', label: 'Renovar el pasaporte' }, // NEW
  ],
  it: [
    { id: 'que-es-el-aire', label: 'Cos’è l’AIRE' }, // NEW
    { id: 'como-inscribirse', label: 'Come iscriversi da Siviglia' }, // NEW
    { id: 'documentos', label: 'Quali documenti servono' }, // NEW
    { id: 'cambiar-direccion', label: 'Cambiare indirizzo' }, // NEW
    { id: 'renovar-pasaporte', label: 'Rinnovare il passaporto' }, // NEW
  ],
};

function bodyEs() {
  return `
      <h2 id="que-es-el-aire">Qué es el AIRE</h2>
      <p>El AIRE es el registro de los italianos residentes en el extranjero. Estar inscrito es obligatorio si vives fuera de Italia más de doce meses, y es lo que te permite votar por correo, renovar el pasaporte en el consulado y pedir certificados sin volver a tu ayuntamiento italiano.</p>
      <p>La inscripción se hace una sola vez. Después, lo único que hay que mantener al día es la dirección.</p>
      ${officialLinksCallout('es', {
        intro: 'El trámite se hace en el portal Fast It. El consulado competente para Sevilla es el Consolato Generale d\'Italia a Madrid.',
        links: [
          { label: 'Portal Fast It — serviziconsolarionline.esteri.it', href: 'https://serviziconsolarionline.esteri.it/' },
          { label: "Consolato Generale d'Italia a Madrid", href: consulateUrl() },
        ],
      })}

      <h2 id="como-inscribirse">Cómo inscribirse desde Sevilla</h2>
      <p>Todo online. No hace falta ir a Madrid, y en la mayoría de los casos tampoco pedir cita.</p>
      ${stepsList([
        'Regístrate en Fast It con un correo al que tengas acceso durante meses: todas las notificaciones llegan ahí.',
        "Asocia tu perfil al Consolato Generale d'Italia a Madrid y espera la validación, que suele tardar unos días.",
        'Abre la solicitud de inscripción en el AIRE y sube el justificante de residencia en España.',
        'Guarda el número de expediente. Es lo que te van a pedir si tienes que reclamar.',
      ])}

      <h2 id="documentos">Qué documentos hacen falta</h2>
      ${documentsList([
        'Documento de identidad italiano en vigor',
        'Certificado de empadronamiento del Ayuntamiento de Sevilla',
        'Codice fiscale',
        'Una dirección postal en Sevilla donde recibir correo certificado',
      ])}
      <blockquote class="u-lead">«Lo más común es olvidarse de actualizar la dirección al cambiar de piso. Es el error que luego bloquea el voto por correo.»</blockquote>

      <h2 id="cambiar-direccion">Cambiar de dirección</h2>
      <p>Si cambias de piso dentro de Sevilla o te mudas a otra ciudad, actualiza la dirección en el AIRE cuanto antes: es la dirección a la que el consulado envía el material de voto y cualquier notificación. Se actualiza desde el mismo portal Fast It, en el servicio de cambio de dirección — no hace falta reabrir todo el trámite de inscripción.</p>
      <p>Mientras la dirección esté sin actualizar, cualquier comunicación del consulado (incluidas las papeletas electorales) puede seguir llegando al domicilio anterior.</p>

      <h2 id="renovar-pasaporte">Renovar el pasaporte</h2>
      <p>El pasaporte italiano se renueva en el Consolato Generale d'Italia a Madrid, no en Italia. Hay que pedir cita a través del sistema de reservas del consulado y presentarse con el pasaporte anterior, el documento de identidad y una foto reciente; el propio consulado indica qué más hace falta según el caso.</p>
      <p>Conviene pedir cita con margen: los plazos de agenda varían según la época del año y no dependen de la asociación ni del trámite del AIRE.</p>`;
}

function bodyIt() {
  return `
      <h2 id="que-es-el-aire">Cos’è l’AIRE</h2>
      <p>L'AIRE è il registro degli italiani residenti all'estero. L'iscrizione è obbligatoria se vivi fuori dall'Italia da più di dodici mesi, e ti permette di votare per corrispondenza, rinnovare il passaporto al consolato e richiedere certificati senza tornare al tuo comune italiano.</p>
      <p>L'iscrizione si fa una sola volta. Dopo, l'unica cosa da tenere aggiornata è l'indirizzo.</p>
      ${officialLinksCallout('it', {
        intro: 'La pratica si svolge sul portale Fast It. Il consolato competente per Siviglia è il Consolato Generale d\'Italia a Madrid.',
        links: [
          { label: 'Portale Fast It — serviziconsolarionline.esteri.it', href: 'https://serviziconsolarionline.esteri.it/' },
          { label: "Consolato Generale d'Italia a Madrid", href: consulateUrl() },
        ],
      })}

      <h2 id="como-inscribirse">Come iscriversi da Siviglia</h2>
      <p>Tutto online. Non serve andare a Madrid, e nella maggior parte dei casi non serve nemmeno prenotare un appuntamento.</p>
      ${stepsList([
        "Registrati su Fast It con un'email a cui avrai accesso per mesi: tutte le notifiche arrivano lì.",
        'Collega il tuo profilo al Consolato Generale d\'Italia a Madrid e aspetta la convalida, che di solito richiede alcuni giorni.',
        "Apri la richiesta di iscrizione all'AIRE e carica il documento che attesta la residenza in Spagna.",
        'Conserva il numero di pratica. È quello che ti chiederanno in caso di reclamo.',
      ])}

      <h2 id="documentos">Quali documenti servono</h2>
      ${documentsList([
        "Documento d'identità italiano in corso di validità",
        'Certificato di residenza anagrafica (empadronamiento) del Comune di Siviglia',
        'Codice fiscale',
        'Un indirizzo postale a Siviglia dove ricevere posta raccomandata',
      ])}
      <blockquote class="u-lead">«L'errore più comune è dimenticarsi di aggiornare l'indirizzo quando si cambia casa. È quello che poi blocca il voto per corrispondenza.»</blockquote>

      <h2 id="cambiar-direccion">Cambiare indirizzo</h2>
      <p>Se cambi casa a Siviglia o ti trasferisci in un'altra città, aggiorna l'indirizzo nell'AIRE il prima possibile: è l'indirizzo a cui il consolato invia il materiale elettorale e qualsiasi comunicazione. Si aggiorna dallo stesso portale Fast It, nella sezione dedicata al cambio di indirizzo — non serve riaprire tutta la pratica di iscrizione.</p>
      <p>Finché l'indirizzo non è aggiornato, qualsiasi comunicazione del consolato (incluse le schede elettorali) può continuare ad arrivare al domicilio precedente.</p>

      <h2 id="renovar-pasaporte">Rinnovare il passaporto</h2>
      <p>Il passaporto italiano si rinnova al Consolato Generale d'Italia a Madrid, non in Italia. Bisogna prenotare un appuntamento tramite il sistema di prenotazioni del consolato e presentarsi con il passaporto precedente, un documento d'identità e una foto recente; è il consolato a indicare di volta in volta cos'altro serve secondo il caso.</p>
      <p>Conviene prenotare con margine: i tempi di attesa variano secondo il periodo dell'anno e non dipendono dall'associazione né dalla pratica dell'AIRE.</p>`;
}

const FAQ = {
  es: [
    {
      q: '¿Pierdo la sanidad italiana si me inscribo?', // verbatim
      a: 'Al inscribirte en el AIRE dejas de estar dado de alta en la ASL de tu región, porque tu asistencia pasa a ser la del país donde resides. En España te atiende el sistema andaluz de salud una vez tienes la tarjeta sanitaria.', // verbatim
    },
    {
      q: '¿Cuánto tarda la inscripción?', // verbatim
      a: 'Varía según el consulado y la época del año. El portal Fast It muestra el estado de la solicitud en todo momento; si pasan varias semanas sin novedad, se puede escribir al consulado para preguntar.', // NEW
    },
    {
      q: '¿Tengo que ir a Madrid en algún momento?', // verbatim
      a: 'No, para la inscripción en el AIRE no. Todo el trámite se hace online desde el portal Fast It. Ir a Madrid solo sería necesario para alguna gestión que el consulado pida hacer en persona, algo poco habitual.', // NEW
    },
    {
      q: '¿Y si vuelvo a Italia?', // verbatim
      a: 'Al volver a residir en Italia hay que darse de baja del AIRE e inscribirse en el ayuntamiento italiano correspondiente. Ese ayuntamiento suele encargarse de comunicar la baja al AIRE.', // NEW
    },
  ],
  it: [
    {
      q: "Perdo l'assistenza sanitaria italiana se mi iscrivo?", // NEW
      a: "Iscrivendoti all'AIRE non risulti più iscritto alla ASL della tua regione, perché la tua assistenza passa al paese in cui risiedi. In Spagna sei assistito dal sistema sanitario andaluso una volta ottenuta la tessera sanitaria.", // NEW
    },
    {
      q: "Quanto tempo richiede l'iscrizione?", // NEW
      a: "Varia secondo il consolato e il periodo dell'anno. Il portale Fast It mostra sempre lo stato della pratica; se passano diverse settimane senza novità, si può scrivere al consolato per chiedere informazioni.", // NEW
    },
    {
      q: 'Devo andare a Madrid in qualche momento?', // NEW
      a: "No, per l'iscrizione all'AIRE no. Tutta la pratica si svolge online sul portale Fast It. Andare a Madrid servirebbe solo per qualche pratica che il consolato chiede di fare di persona, cosa poco frequente.", // NEW
    },
    {
      q: 'E se torno in Italia?', // NEW
      a: "Tornando a risiedere in Italia bisogna cancellarsi dall'AIRE e iscriversi al comune italiano di riferimento. Di solito è lo stesso comune a occuparsi di comunicare la cancellazione all'AIRE.", // NEW
    },
  ],
};

const JOIN_TEXT = {
  es: 'Casi todos los socios han pasado por este trámite. En los encuentros siempre hay alguien que puede contarte cómo lo resolvió, y en el grupo se responde en horas.', // verbatim, artboard
  it: 'Quasi tutti i soci sono già passati per questa pratica. Agli incontri c’è sempre qualcuno che può raccontarti come l’ha risolta, e nel gruppo si risponde in poche ore.', // NEW
};

export default {
  id: ARTICLE_ID,
  async build() {
    for (const locale of LOCALES) {
      const alternates = routes.get(ARTICLE_ID);
      const bodyHtml = locale === 'es' ? bodyEs() : bodyIt();
      const faq = FAQ[locale];

      const body = articleShell({
        locale,
        articleId: ARTICLE_ID,
        lead: LEAD[locale],
        joinText: JOIN_TEXT[locale],
        bodyHtml,
        sections: SECTIONS[locale],
        faq,
      });

      writePage(alternates[locale], renderPage({
        locale,
        alternates,
        activeNav: 'guide',
        title: `AIRE y consulado — ${data.site.org.legalName}`,
        description: DESCRIPTION[locale],
        jsonld: articleJsonLd(locale, {
          headline: locale === 'es' ? 'AIRE y consulado' : 'AIRE e consolato',
          description: DESCRIPTION[locale],
        }, faq),
        body,
      }));
    }
  },
};
