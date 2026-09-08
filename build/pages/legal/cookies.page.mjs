/**
 * Cookie policy — /es/legal/cookies and /it/legale/cookie.
 *
 * New copy (build/pages/README.md rule 5) describing exactly what
 * assets/js/cookies.js and assets/js/lang.js actually do: two localStorage
 * keys, no tracking cookies, nothing loaded before consent. Flagged as
 * unvalidated legal text in IMPLEMENTATION-LOG.md — a human with legal
 * competence must review it before launch, same as the other legal pages.
 *
 * The "change your choice" button re-opens #cookie-banner via the
 * data-cookie-manage hook that assets/js/cookies.js listens for
 * (delegated on document, so it works without any page-specific script).
 */
import { data, routeOf, routes, renderPage, writePage, esc, LOCALES, ui } from '../../build.mjs';

const LABEL = { es: 'Política de cookies', it: 'Cookie policy' };

const DESCRIPTION = {
  es: 'Qué guarda esta web en tu navegador: dos claves de almacenamiento local, sin cookies de rastreo, y cómo cambiar tu decisión sobre el aviso de cookies.',
  it: 'Cosa salva questo sito nel tuo browser: due chiavi di archiviazione locale, nessun cookie di tracciamento, e come cambiare la tua decisione sull’avviso cookie.',
};

export default {
  id: 'cookies',
  async build() {
    for (const locale of LOCALES) {
      const alternates = routes.get('cookies');
      const t = ui[locale];

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
        body: locale === 'es' ? bodyEs() : bodyIt(),
      }));
    }
  },
};

function bodyEs() {
  return `
<section class="section section--crema">
  <div class="wrap">
    <nav class="breadcrumb" aria-label="Ruta de navegación">
      <ol>
        <li><a href="${routeOf('home', 'es')}">Inicio</a></li>
        <li aria-current="page">Política de cookies</li>
      </ol>
    </nav>
    <span class="tricolore" aria-hidden="true"><i></i><i></i><i></i></span>
    <h1>Política de cookies</h1>
    <p class="u-lead">Qué guardamos en tu navegador cuando visitas esta web, y cómo puedes cambiar de opinión.</p>

    <div class="prose">
      <h2>1. Qué usamos</h2>
      <p>Esta web no usa cookies de rastreo ni de publicidad. Usamos el almacenamiento local de tu navegador (<code>localStorage</code>) para dos cosas muy concretas: recordar tu elección sobre este aviso y recordar en qué idioma prefieres leer la web. Ninguna de las dos identifica a personas ni sale de tu navegador.</p>

      <h2>2. Detalle de lo que guardamos</h2>
      <ul>
        <li><code>ais:cookie-consent</code> — tu decisión (aceptar o rechazar). Se guarda al pulsar uno de los botones del aviso y se mantiene hasta que la cambies o borres los datos de este sitio en tu navegador.</li>
        <li><code>ais:lang</code> — el idioma que elegiste con el selector ES/IT. Solo sirve para recordar tu preferencia; nunca te redirige fuera de la página en la que estás.</li>
      </ul>

      <h2>3. Cookies de terceros</h2>
      <p>Algunas páginas pueden incluir contenido de terceros (por ejemplo, entradas de Eventbrite, mapas o publicaciones de redes sociales) que puede instalar sus propias cookies según la política de ese proveedor. Te lo indicaremos en la propia página cuando ocurra.</p>

      <h2>4. Medición y analítica</h2>
      <p>Hoy no hay ninguna cookie ni script de medición activo en el sitio. Si en el futuro añadimos analítica, se cargará únicamente después de que pulses «Aceptar» en el aviso de cookies — nunca antes.</p>

      <h2>5. Cómo cambiar tu decisión</h2>
      <p>Puedes volver a abrir el aviso cuando quieras:</p>
      <p><button type="button" class="btn btn--secondary" data-cookie-manage>Cambiar mi elección</button></p>
      <noscript><p>Con JavaScript desactivado no podemos volver a mostrarte el aviso desde aquí: borra los datos de este sitio desde los ajustes de tu navegador para que se te vuelva a preguntar.</p></noscript>

      <h2>6. Más información</h2>
      <p>Para saber qué datos personales tratamos y con qué base legal, consulta la <a href="${routeOf('privacy', 'es')}">Política de privacidad</a>.</p>
    </div>
  </div>
</section>`;
}

function bodyIt() {
  return `
<section class="section section--crema">
  <div class="wrap">
    <nav class="breadcrumb" aria-label="Percorso di navigazione">
      <ol>
        <li><a href="${routeOf('home', 'it')}">Home</a></li>
        <li aria-current="page">Cookie policy</li>
      </ol>
    </nav>
    <span class="tricolore" aria-hidden="true"><i></i><i></i><i></i></span>
    <h1>Cookie policy</h1>
    <p class="u-lead">Cosa salviamo nel tuo browser quando visiti questo sito, e come puoi cambiare idea.</p>

    <div class="prose">
      <h2>1. Cosa usiamo</h2>
      <p>Questo sito non usa cookie di tracciamento né pubblicitari. Usiamo l'archiviazione locale del tuo browser (<code>localStorage</code>) per due cose molto precise: ricordare la tua scelta su questo avviso e ricordare in quale lingua preferisci leggere il sito. Nessuna delle due identifica le persone né esce dal tuo browser.</p>

      <h2>2. Nel dettaglio</h2>
      <ul>
        <li><code>ais:cookie-consent</code> — la tua decisione (accetta o rifiuta). Si salva quando premi uno dei pulsanti dell'avviso e resta finché non la cambi o non cancelli i dati di questo sito dal tuo browser.</li>
        <li><code>ais:lang</code> — la lingua scelta con il selettore ES/IT. Serve solo a ricordare la tua preferenza; non ti reindirizza mai fuori dalla pagina in cui ti trovi.</li>
      </ul>

      <h2>3. Cookie di terze parti</h2>
      <p>Alcune pagine possono includere contenuti di terze parti (per esempio biglietti Eventbrite, mappe o post dei social) che possono installare propri cookie secondo la policy di quel fornitore. Te lo segnaleremo direttamente nella pagina in questione.</p>

      <h2>4. Misurazione e analitica</h2>
      <p>Al momento non è attivo nessun cookie né script di misurazione sul sito. Se in futuro aggiungeremo strumenti di analisi, si caricheranno solo dopo aver premuto «Accetta» nell'avviso cookie — mai prima.</p>

      <h2>5. Come cambiare la tua decisione</h2>
      <p>Puoi riaprire l'avviso quando vuoi:</p>
      <p><button type="button" class="btn btn--secondary" data-cookie-manage>Cambia la mia scelta</button></p>
      <noscript><p>Con JavaScript disattivato non possiamo mostrarti di nuovo l'avviso da qui: cancella i dati di questo sito dalle impostazioni del tuo browser perché la domanda ricompaia.</p></noscript>

      <h2>6. Per saperne di più</h2>
      <p>Per sapere quali dati personali trattiamo e con quale base giuridica, consulta l'<a href="${routeOf('privacy', 'it')}">Informativa privacy</a>.</p>
    </div>
  </div>
</section>`;
}
