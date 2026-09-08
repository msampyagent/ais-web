/**
 * Guía práctica — Llegar a Sevilla.
 *
 * No artboard covers this article. All copy on this page — both languages —
 * is new, written in the same dry, concrete register as the AIRE article,
 * and is flagged as unvalidated in IMPLEMENTATION-LOG.md. It intentionally
 * stays generic on anything that changes often or that ais-brief/data does
 * not record (transport fares, extranjería office URLs, appointment
 * turnaround): naming a specific government URL this build cannot verify
 * would be worse than not linking at all, so the only outbound official
 * link on this page (Ayuntamiento de Sevilla) is a URL already vetted in
 * ais-brief/data/site.json — nothing here is invented.
 */
import { data, routes, routeOf, renderPage, writePage, esc, LOCALES } from '../../build.mjs';
import { articleShell, articleJsonLd, officialLinksCallout } from './index.page.mjs';

const ARTICLE_ID = 'arrive';

const LEAD = {
  es: 'Empadronamiento, NIE, buscar piso y moverte por la ciudad: lo primero que hay que resolver al llegar a Sevilla.', // NEW
  it: 'Residenza anagrafica, NIE, trovare casa e muoversi in città: le prime cose da sistemare arrivando a Siviglia.', // NEW
};

const DESCRIPTION = {
  es: 'Los primeros trámites al mudarte a Sevilla: empadronamiento en el Ayuntamiento, NIE y certificado de residencia, buscar piso y moverte por la ciudad.',
  it: 'Le prime pratiche quando ti trasferisci a Siviglia: residenza anagrafica al Comune, NIE e certificato di residenza, trovare casa e muoversi in città.',
};

function institutionUrl(name) {
  return data.site.institutions.find((i) => i.name === name)?.url ?? '#';
}

const SECTIONS = {
  es: [
    { id: 'empadronamiento', label: 'Empadronarte en el Ayuntamiento' },
    { id: 'nie-residencia', label: 'El NIE y el certificado de residencia' },
    { id: 'buscar-piso', label: 'Encontrar piso' },
    { id: 'transporte', label: 'Moverte por Sevilla' },
  ],
  it: [
    { id: 'empadronamiento', label: 'Iscriversi all’anagrafe (empadronamiento)' },
    { id: 'nie-residencia', label: 'Il NIE e il certificato di residenza' },
    { id: 'buscar-piso', label: 'Trovare casa' },
    { id: 'transporte', label: 'Muoversi a Siviglia' },
  ],
};

function bodyEs() {
  return `
      <h2 id="empadronamiento">Empadronarte en el Ayuntamiento</h2>
      <p>El empadronamiento es la inscripción en el padrón municipal del Ayuntamiento de Sevilla: certifica que resides en la ciudad y es el primer trámite que conviene hacer al llegar, porque muchos otros dependen de él (el NIE, la sanidad, la escolarización, la propia inscripción en el AIRE).</p>
      <p>Se pide cita previa con el Ayuntamiento y se presenta el contrato de alquiler o la autorización de quien te aloja, junto con el documento de identidad. El certificado de empadronamiento se puede volver a pedir después, cuando haga falta para otro trámite.</p>
      ${officialLinksCallout('es', {
        intro: 'El trámite se gestiona directamente con el Ayuntamiento de Sevilla.',
        links: [{ label: 'Ayuntamiento de Sevilla', href: institutionUrl('Ayuntamiento de Sevilla') }],
      })}

      <h2 id="nie-residencia">El NIE y el certificado de residencia</h2>
      <p>El NIE (Número de Identidad de Extranjero) es el número que te van a pedir para casi todo en España: abrir una cuenta bancaria, firmar un contrato de alquiler o de trabajo, darte de alta como autónomo. Al ser ciudadano de la Unión Europea, el trámite equivalente es el Certificado de Registro de Ciudadano de la Unión, que incluye el NIE.</p>
      <p>Se solicita en la Oficina de Extranjería o en una comisaría de la Policía Nacional habilitada, pidiendo cita previa con antelación: la disponibilidad de citas varía mucho según la época del año.</p>

      <h2 id="buscar-piso">Encontrar piso</h2>
      <p>La búsqueda de piso en Sevilla se hace sobre todo a través de portales inmobiliarios generalistas. Para firmar un contrato suele pedirse el NIE y, en alquileres de larga duración, justificante de ingresos o nómina — algo que quien acaba de llegar no siempre tiene todavía, lo que puede alargar la búsqueda.</p>
      <p>Conviene desconfiar de quien pide una señal o el primer mes de alquiler antes de haber visto el piso en persona o por videollamada en directo: es el fraude más habitual con quien llega de fuera.</p>

      <h2 id="transporte">Moverte por Sevilla</h2>
      <p>Sevilla se mueve principalmente en autobús urbano (Tussam), con una línea de metro que atraviesa la ciudad y un sistema de bicicletas públicas (Sevici). El centro histórico es compacto y se recorre bien a pie.</p>
      <p>Para trayectos frecuentes conviene informarse directamente en el operador sobre abonos y tarjetas de transporte: las condiciones cambian con cierta frecuencia y esta guía no sustituye la información oficial actualizada.</p>`;
}

function bodyIt() {
  return `
      <h2 id="empadronamiento">Iscriversi all’anagrafe (empadronamiento)</h2>
      <p>L'empadronamiento è l'iscrizione all'anagrafe comunale del Comune di Siviglia: certifica che risiedi in città ed è la prima pratica da fare all'arrivo, perché molte altre ne dipendono (il NIE, la sanità, l'iscrizione scolastica, la stessa iscrizione all'AIRE).</p>
      <p>Si richiede un appuntamento con il Comune e si presenta il contratto d'affitto o l'autorizzazione di chi ti ospita, insieme al documento d'identità. Il certificato di residenza anagrafica si può richiedere di nuovo in seguito, quando serve per un'altra pratica.</p>
      ${officialLinksCallout('it', {
        intro: 'La pratica si gestisce direttamente con il Comune di Siviglia (Ayuntamiento de Sevilla).',
        links: [{ label: 'Ayuntamiento de Sevilla', href: institutionUrl('Ayuntamiento de Sevilla') }],
      })}

      <h2 id="nie-residencia">Il NIE e il certificato di residenza</h2>
      <p>Il NIE (Número de Identidad de Extranjero) è il numero che ti verrà chiesto per quasi tutto in Spagna: aprire un conto in banca, firmare un contratto d'affitto o di lavoro, iscriverti come autonomo. Essendo cittadino dell'Unione Europea, la pratica equivalente è il Certificado de Registro de Ciudadano de la Unión, che include il NIE.</p>
      <p>Si richiede presso l'Oficina de Extranjería o in una questura della Policía Nacional abilitata, prenotando un appuntamento con anticipo: la disponibilità varia molto secondo il periodo dell'anno.</p>

      <h2 id="buscar-piso">Trovare casa</h2>
      <p>La ricerca di un appartamento a Siviglia si fa soprattutto tramite i portali immobiliari generalisti. Per firmare un contratto viene solitamente richiesto il NIE e, per gli affitti di lunga durata, una busta paga o una prova di reddito — cosa che chi è appena arrivato non sempre ha ancora, il che può allungare la ricerca.</p>
      <p>Conviene diffidare di chi chiede una caparra o il primo mese d'affitto prima di aver visto l'appartamento di persona o in videochiamata dal vivo: è la truffa più comune ai danni di chi arriva da fuori.</p>

      <h2 id="transporte">Muoversi a Siviglia</h2>
      <p>Siviglia si muove principalmente con l'autobus urbano (Tussam), una linea di metropolitana che attraversa la città e un sistema di biciclette pubbliche (Sevici). Il centro storico è compatto e si percorre bene a piedi.</p>
      <p>Per gli spostamenti frequenti conviene informarsi direttamente presso il gestore su abbonamenti e tessere di trasporto: le condizioni cambiano con una certa frequenza e questa guida non sostituisce l'informazione ufficiale aggiornata.</p>`;
}

const FAQ = {
  es: [
    { q: '¿Puedo empadronarme sin contrato de alquiler a mi nombre?', a: 'Depende del caso: si vives con alguien que ya está empadronado, esa persona puede autorizarte. El Ayuntamiento indica en cada caso qué documento concreto hace falta.' },
    { q: '¿El NIE y el certificado de residencia son lo mismo?', a: 'No exactamente: el NIE es solo el número identificativo; el Certificado de Registro de Ciudadano de la Unión es el documento que, como ciudadano italiano, acredita tu residencia y lleva ese número asignado.' },
    { q: '¿La asociación ayuda a buscar piso?', a: 'No directamente, pero en los encuentros de AIS suele haber socios que ya han pasado por la búsqueda en Sevilla y pueden orientar con lo básico.' },
  ],
  it: [
    { q: "Posso fare l'empadronamiento senza un contratto d'affitto a mio nome?", a: "Dipende dal caso: se vivi con qualcuno già iscritto all'anagrafe, quella persona può autorizzarti. Il Comune indica caso per caso quale documento specifico serve." },
    { q: 'Il NIE e il certificato di residenza sono la stessa cosa?', a: 'Non esattamente: il NIE è solo il numero identificativo; il Certificado de Registro de Ciudadano de la Unión è il documento che, come cittadino italiano, attesta la tua residenza e riporta quel numero assegnato.' },
    { q: "L'associazione aiuta a trovare casa?", a: "Non direttamente, ma agli incontri di AIS ci sono spesso soci che sono già passati per la ricerca a Siviglia e possono dare qualche indicazione di base." },
  ],
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
        joinText: null,
        bodyHtml,
        sections: SECTIONS[locale],
        faq,
      });

      writePage(alternates[locale], renderPage({
        locale,
        alternates,
        activeNav: 'guide',
        title: `Llegar a Sevilla — ${data.site.org.legalName}`,
        description: DESCRIPTION[locale],
        jsonld: articleJsonLd(locale, {
          headline: locale === 'es' ? 'Llegar a Sevilla' : 'Arrivare a Siviglia',
          description: DESCRIPTION[locale],
        }, faq),
        body,
      }));
    }
  },
};
