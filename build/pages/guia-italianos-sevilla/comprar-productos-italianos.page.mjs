/**
 * Dónde comprar productos italianos / Dove comprare prodotti italiani.
 *
 * The fourth guide article, with no dedicated artboard in this batch. New
 * copy written in the same dry register and flagged as unvalidated.
 */
import { data, routes, routeOf, renderPage, writePage, esc, LOCALES, ORIGIN, fileDate } from '../../build.mjs';
import { articleShell, articleJsonLd, T } from './index.page.mjs';

const ARTICLE_ID = 'italianfood';
/** Honest dateModified: this module file's mtime — never an invented date. */
const ARTICLE_DATE = fileDate(import.meta.url);

const LEAD = {
  es: 'Dónde encontrar producto italiano de verdad en Sevilla: tiendas físicas, mercados, supermercados con sección italiana y algunos consejos prácticos.',
  it: 'Dove trovare prodotti italiani veri a Siviglia: negozi fisici, mercati, supermercati con reparto italiano e alcuni consigli pratici.',
};

const DESCRIPTION = {
  es: 'Guía para comprar productos italianos en Sevilla: tiendas de referencia, mercados, etiquetas y cómo reconocer el auténtico producto.',
  it: 'Guida per comprare prodotti italiani a Siviglia: negozi di riferimento, mercati, etichette e come riconoscere il prodotto autentico.',
};

const SECTIONS = {
  es: [
    { id: 'supermercados', label: 'Supermercados con sección italiana' },
    { id: 'tiendas', label: 'Tiendas especializadas' },
    { id: 'mercados', label: 'Mercados y puestos' },
    { id: 'temporada', label: 'Productos de temporada' },
    { id: 'etiqueta', label: 'Cómo leer la etiqueta' },
  ],
  it: [
    { id: 'supermercados', label: 'Supermercati con reparto italiano' },
    { id: 'tiendas', label: 'Negozi specializzati' },
    { id: 'mercados', label: 'Mercati e banchi' },
    { id: 'temporada', label: 'Prodotti di stagione' },
    { id: 'etiqueta', label: 'Come leggere l’etichetta' },
  ],
};

function partnerList(locale) {
  const items = data.convenios.items
    .filter((c) => c.status === 'active' && c.category === 'alimentacion')
    .map((c) => `<li><strong>${esc(c.name)}</strong> — ${esc(c.address.street)}, ${esc(c.address.locality)}. ${esc(c.description[locale])}</li>`);
  return items.length ? `<ul class="list-giralda">${items.join('')}</ul>` : '';
}

function bodyEs() {
  return `
      <h2 id="supermercados">Supermercados con sección italiana</h2>
      <p>Varias cadenas de Sevilla tienen un pequeño reparto de productos italianos. No suelen tener la variedad de una tienda especializada, pero sirven para lo básico: pasta seca, conservas, aceite y algunos quesos industriales.</p>

      <h2 id="tiendas">Tiendas especializadas</h2>
      <p>Las tiendas dedicadas exclusivamente a productos italianos son la mejor opción cuando buscas quesos, embutidos, vinos o ingredientes para una receta concreta. Entre las que colaboran con AIS:</p>
      ${partnerList('es')}
      <p>Si no encuentras un producto concreto, lo normal es pedirlo con varios días de antelación.</p>

      <h2 id="mercados">Mercados y puestos</h2>
      <p>El Mercado de Triana y el Mercado del Arenal suelen tener puestos con quesos italianos, aceitunas y embutidos. La disponibilidad varía; conviene preguntar directamente al puesto si tiene un producto en concreto.</p>

      <h2 id="temporada">Productos de temporada</h2>
      <p>El panettone, la colomba, los torroni y otros dulces de temporada llegan con antelación a las tiendas especializadas. Los quesos frescos y las verduras dependen de la importación semanal, por lo que no siempre están disponibles.</p>

      <h2 id="etiqueta">Cómo leer la etiqueta</h2>
      <p>No basta con que el envase tenga colores tricolores. Fíjate en el país de origen y en el número de identificación del establecimiento (que comienza por IT). Las expresiones "estilo italiano" o "sabor italiano" no garantizan que el producto sea de Italia. Si buscas una denominación protegida, busca las siglas DOP o IGP.</p>`;
}

function bodyIt() {
  return `
      <h2 id="supermercados">Supermercati con reparto italiano</h2>
      <p>Diverse catene di Siviglia hanno un piccolo reparto di prodotti italiani. Non hanno la varietà di un negozio specializzato, ma vanno bene per le cose di base: pasta secca, conserve, olio e alcuni formaggi industriali.</p>

      <h2 id="tiendas">Negozi specializzati</h2>
      <p>I negozi dedicati esclusivamente a prodotti italiani sono la scelta migliore quando cerchi formaggi, salumi, vini o ingredienti per una ricetta precisa. Tra quelli che collaborano con AIS:</p>
      ${partnerList('it')}
      <p>Se non trovi un prodotto specifico, di solito si può ordinare con qualche giorno di anticipo.</p>

      <h2 id="mercados">Mercati e banchi</h2>
      <p>Il Mercado de Triana e il Mercado del Arenal di solito hanno banchi con formaggi italiani, olive e salumi. La disponibilità varia; conviene chiedere direttamente al banco se ha un prodotto specifico.</p>

      <h2 id="temporada">Prodotti di stagione</h2>
      <p>Il panettone, la colomba, i torroni e altri dolci di stagione arrivano con anticipo nei negozi specializzati. I formaggi freschi e le verdure dipendono dall’importazione settimanale, quindi non sono sempre disponibili.</p>

      <h2 id="etiqueta">Come leggere l’etichetta</h2>
      <p>Non basta che la confezione abbia i colori del tricolore. Controlla il paese d’origine e il numero di identificazione dello stabilimento (che inizia per IT). Le espressioni "stile italiano" o "sapore italiano" non garantiscono che il prodotto sia d’Italia. Se cerchi una denominazione protetta, cerca le sigle DOP o IGP.</p>`;
}

const FAQ = {
  es: [
    { q: '¿Dónde compro pasta fresca en Sevilla?', a: 'En tiendas especializadas como las que aparecen arriba; los supermercados suelen tener solo pasta seca.' },
    { q: '¿Puedo pedir productos italianos online?', a: 'Algunas tiendas físicas envían a domicilio en Sevilla; pregunta directamente en el comercio.' },
    { q: '¿Cómo sé si un queso es realmente italiano?', a: 'Comprueba el país de origen y las siglas DOP o IGP en la etiqueta. "Estilo italiano" no es lo mismo que producto de Italia.' },
  ],
  it: [
    { q: 'Dove compro la pasta fresca a Siviglia?', a: 'Nei negozi specializzati come quelli indicati sopra; i supermercati di solito hanno solo pasta secca.' },
    { q: 'Posso ordinare prodotti italiani online?', a: 'Alcuni negozi fisici consegnano a domicilio a Siviglia; chiedi direttamente al negozio.' },
    { q: 'Come faccio a sapere se un formaggio è davvero italiano?', a: 'Controlla il paese d’origine e le sigle DOP o IGP in etichetta. "Stile italiano" non è la stessa cosa di prodotto d’Italia.' },
  ],
};

const JOIN_TEXT = {
  es: 'Muchos socios conocen los mejores puestos y las temporadas exactas. En los encuentros se comparten direcciones que no aparecen en las guías generales.',
  it: 'Molti soci conoscono i migliori banchi e le stagioni giuste. Agli incontri si condividono indirizzi che non si trovano nelle guide generiche.',
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
        title: `${esc(T[locale].hubTitle)} — ${data.site.org.legalName}`,
        description: DESCRIPTION[locale],
        breadcrumb: [
          { label: T[locale].home, href: routeOf('home', locale) },
          { label: T[locale].guideLabel, href: routeOf('guide', locale) },
          { label: T[locale].hubTitle, href: alternates[locale] },
        ],
        jsonld: articleJsonLd(locale, {
          headline: T[locale].hubTitle,
          description: DESCRIPTION[locale],
          url: `${ORIGIN}${alternates[locale]}`,
          dateModified: ARTICLE_DATE,
        }, faq),
        article: { modified: ARTICLE_DATE },
        lastmod: ARTICLE_DATE,
        body,
      }));
    }
  },
};
