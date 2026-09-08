/**
 * Guía práctica — Com.It.Es. y voto.
 *
 * No artboard covers this article (1streview/AIS Guia Practica.dc.html
 * shows only "AIRE y consulado" in detail). All copy on this page — both
 * languages — is new, written in the same dry, concrete register as the
 * AIRE article, and is flagged as unvalidated in IMPLEMENTATION-LOG.md.
 * It should be checked by someone who can confirm the Com.It.Es. Madrid
 * mandate and current election calendar before publishing.
 *
 * The only two facts asserted here that are NOT invented are: (1) that
 * Sevilla falls under the Consolato Generale d'Italia a Madrid / Com.It.Es.
 * Madrid circumscription, and (2) the two institutions' names and URLs —
 * both already present in ais-brief/data/site.json's `institutions` array.
 * No election dates, deadlines or mandate lengths are stated, because none
 * are recorded anywhere in ais-brief/data.
 */
import { data, routes, routeOf, renderPage, writePage, esc, LOCALES } from '../../build.mjs';
import { articleShell, articleJsonLd, officialLinksCallout } from './index.page.mjs';

const ARTICLE_ID = 'comites';

const LEAD = {
  es: 'La representación de los italianos en el exterior y cómo votar desde Sevilla sin viajar a Italia.', // NEW
  it: 'La rappresentanza degli italiani all’estero e come votare da Siviglia senza tornare in Italia.', // NEW
};

const DESCRIPTION = {
  es: 'Qué es el Com.It.Es. Madrid, quién forma parte de él y cómo se vota desde Sevilla en las elecciones políticas, los referéndums y las elecciones del propio Com.It.Es.',
  it: 'Cos’è il Com.It.Es. Madrid, chi ne fa parte e come si vota da Siviglia alle elezioni politiche, ai referendum e alle elezioni dello stesso Com.It.Es.',
};

function institutionUrl(name) {
  return data.site.institutions.find((i) => i.name === name)?.url ?? '#';
}

const SECTIONS = {
  es: [
    { id: 'que-es-comites', label: 'Qué es el Com.It.Es.' },
    { id: 'como-se-vota', label: 'Cómo se vota desde el extranjero' },
    { id: 'que-se-vota', label: 'En qué elecciones se puede votar' },
  ],
  it: [
    { id: 'que-es-comites', label: 'Cos’è il Com.It.Es.' },
    { id: 'como-se-vota', label: 'Come si vota dall’estero' },
    { id: 'que-se-vota', label: 'In quali elezioni si può votare' },
  ],
};

function bodyEs() {
  return `
      <h2 id="que-es-comites">Qué es el Com.It.Es.</h2>
      <p>El Com.It.Es. (Comitato degli Italiani all'Estero) es el órgano que representa a los italianos residentes en una circunscripción consular ante las instituciones italianas y locales. Sevilla depende de la circunscripción del Consolato Generale d'Italia a Madrid, así que los italianos inscritos aquí en el AIRE eligen y son representados por el Com.It.Es. Madrid.</p>
      <p>Sus miembros son italianos inscritos en el AIRE de esa circunscripción, elegidos por votación directa entre los propios inscritos.</p>
      ${officialLinksCallout('es', {
        intro: 'El Com.It.Es. Madrid tiene su propia web, y el consulado publica ahí la información electoral cuando toca renovarlo.',
        links: [
          { label: 'Com.It.Es. Madrid', href: institutionUrl('Com.It.Es. Madrid') },
          { label: "Consolato Generale d'Italia a Madrid", href: institutionUrl("Consolato Generale d'Italia a Madrid") },
        ],
      })}

      <h2 id="como-se-vota">Cómo se vota desde el extranjero</h2>
      <p>Para votar desde el extranjero — tanto en las elecciones del Com.It.Es. como en las elecciones políticas y los referéndums italianos — hace falta estar inscrito en el AIRE con la dirección actualizada. El consulado envía el material de voto por correo a esa dirección; se rellena y se devuelve también por correo, dentro del plazo que indique cada convocatoria.</p>
      <p>Si te acabas de inscribir en el AIRE o has cambiado de dirección hace poco, conviene comprobar con tiempo que el consulado tiene el dato correcto — ver <a href="${routeOf('aire', 'es')}">AIRE y consulado</a>.</p>

      <h2 id="que-se-vota">En qué elecciones se puede votar</h2>
      <p>Desde el extranjero se puede votar en tres tipos de convocatoria: las elecciones políticas italianas (Parlamento), los referéndums nacionales y las elecciones del propio Com.It.Es., que se convocan cada varios años entre los inscritos en el AIRE de cada circunscripción.</p>
      <p>Cada convocatoria tiene sus propios plazos, publicados por el consulado con antelación. La asociación no gestiona el voto ni el envío del material electoral: son trámites exclusivamente entre cada persona inscrita y el consulado.</p>`;
}

function bodyIt() {
  return `
      <h2 id="que-es-comites">Cos’è il Com.It.Es.</h2>
      <p>Il Com.It.Es. (Comitato degli Italiani all'Estero) è l'organo che rappresenta gli italiani residenti in una circoscrizione consolare presso le istituzioni italiane e locali. Siviglia dipende dalla circoscrizione del Consolato Generale d'Italia a Madrid, quindi gli italiani iscritti qui all'AIRE sono rappresentati dal Com.It.Es. Madrid.</p>
      <p>I suoi membri sono italiani iscritti all'AIRE di quella circoscrizione, eletti con voto diretto tra gli stessi iscritti.</p>
      ${officialLinksCallout('it', {
        intro: 'Il Com.It.Es. Madrid ha un proprio sito, e il consolato vi pubblica le informazioni elettorali quando è il momento di rinnovarlo.',
        links: [
          { label: 'Com.It.Es. Madrid', href: institutionUrl('Com.It.Es. Madrid') },
          { label: "Consolato Generale d'Italia a Madrid", href: institutionUrl("Consolato Generale d'Italia a Madrid") },
        ],
      })}

      <h2 id="como-se-vota">Come si vota dall’estero</h2>
      <p>Per votare dall'estero — sia per le elezioni del Com.It.Es. sia per le elezioni politiche e i referendum italiani — bisogna essere iscritti all'AIRE con l'indirizzo aggiornato. Il consolato invia il materiale elettorale per posta a quell'indirizzo; si compila e si rispedisce anch'esso per posta, entro il termine indicato da ogni convocazione.</p>
      <p>Se ti sei appena iscritto all'AIRE o hai cambiato indirizzo di recente, conviene verificare per tempo che il consolato abbia il dato corretto — vedi <a href="${routeOf('aire', 'it')}">AIRE e consolato</a>.</p>

      <h2 id="que-se-vota">In quali elezioni si può votare</h2>
      <p>Dall'estero si può votare in tre tipi di consultazione: le elezioni politiche italiane (Parlamento), i referendum nazionali e le elezioni dello stesso Com.It.Es., convocate ogni alcuni anni tra gli iscritti all'AIRE di ciascuna circoscrizione.</p>
      <p>Ogni consultazione ha le proprie scadenze, pubblicate dal consolato con anticipo. L'associazione non gestisce il voto né l'invio del materiale elettorale: sono pratiche esclusivamente tra ogni persona iscritta e il consolato.</p>`;
}

const FAQ = {
  es: [
    { q: '¿Puedo votar si no estoy inscrito en el AIRE?', a: 'No. La inscripción en el AIRE es el requisito previo para recibir el material de voto en el extranjero, ya sea para el Com.It.Es., para el Parlamento o para un referéndum.' },
    { q: '¿Qué hace exactamente el Com.It.Es.?', a: 'Traslada a las instituciones italianas y locales las necesidades de la comunidad italiana de su circunscripción: puede proponer, informar y ser consultado, aunque no tiene funciones ejecutivas.' },
    { q: '¿La asociación organiza el voto?', a: 'No. AIS no gestiona el censo ni el envío del material electoral — es competencia del consulado. La asociación puede ayudar a resolver dudas prácticas, pero el trámite es siempre entre cada persona y el consulado.' },
  ],
  it: [
    { q: "Posso votare se non sono iscritto all'AIRE?", a: "No. L'iscrizione all'AIRE è il requisito preliminare per ricevere il materiale di voto all'estero, sia per il Com.It.Es., sia per il Parlamento, sia per un referendum." },
    { q: 'Cosa fa esattamente il Com.It.Es.?', a: 'Porta alle istituzioni italiane e locali le esigenze della comunità italiana della sua circoscrizione: può proporre, informare ed essere consultato, anche se non ha funzioni esecutive.' },
    { q: "L'associazione organizza il voto?", a: "No. AIS non gestisce l'anagrafe né l'invio del materiale elettorale — è competenza del consolato. L'associazione può aiutare a chiarire dubbi pratici, ma la pratica resta sempre tra ogni persona e il consolato." },
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
        title: `Com.It.Es. y voto — ${data.site.org.legalName}`,
        description: DESCRIPTION[locale],
        jsonld: articleJsonLd(locale, {
          headline: locale === 'es' ? 'Com.It.Es. y voto' : 'Com.It.Es. e voto',
          description: DESCRIPTION[locale],
        }, faq),
        body,
      }));
    }
  },
};
