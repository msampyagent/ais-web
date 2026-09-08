/**
 * Events — shared helpers + /eventos/ and /eventi/ (the main calendar).
 *
 * This file is the hub for the whole events tree: it owns the date/price/
 * language formatting, the event-card and filter-rail markup, and the
 * pagination helper, all as named exports reused by archive.page.mjs,
 * series.page.mjs and detail.page.mjs. Only the default export (`build()`)
 * is a page in its own right — it produces the "Calendario" page shown in
 * AIS Eventos.dc.html: filter rail, 3-up upcoming grid, archive teaser.
 *
 * Source of truth: 1streview/AIS Eventos.dc.html (visual) and
 * ais-brief/data/events.json (content). Where the two disagree on a data
 * field (e.g. the Feria's "Entrada gratuita, para todos" in the artboard vs.
 * "Entrada gratuita" in price.note), the JSON wins because it is the
 * structured record; the artboard governs layout and chrome copy. Every
 * such call is listed in IMPLEMENTATION-LOG.md.
 */
import { data, routes, routeOf, registerRoute, renderPage, writePage, esc, LOCALES } from '../../build.mjs';

/* ---------------------------------------------------------------------------
 * Event routes — registered here, at MODULE SCOPE, not inside build().
 *
 * The bug this fixes: eventCardHTML() (below) calls routeOf(ev.id, locale)
 * for every event it renders a card for. routeOf() throws on an id nobody
 * has registered. Nothing in this codebase ever called registerRoute() for
 * an individual event, so the very first card crashed the build with
 * `Unknown route id: "incontro-letterario-il-resto-di-niente"`.
 *
 * Why the fix lives here rather than in each page's build(): build/build.mjs
 * discovers *.page.mjs files with a directory walk and, for each file,
 * imports it and immediately awaits its build() before moving to the next
 * file (see build/build.mjs main()). That import/build pair happens in
 * whatever order readdirSync() hands back — effectively alphabetical, per
 * CLAUDE.md/this task's own framing — so archive.page.mjs, detail.page.mjs,
 * feria.page.mjs, letterari.page.mjs and patrocinio.page.mjs would all have
 * their build() called before index.page.mjs's own build() ever runs.
 *
 * But every one of those files imports its shared helpers (T, eventCardHTML,
 * breadcrumb, baseTrail, paginate...) from *this* file. An ES module's
 * top-level code always runs on its first import, synchronously, before the
 * importing module's own code continues — so as soon as build.mjs imports,
 * say, archive.page.mjs, that file's own `import ... from './index.page.mjs'`
 * line forces this file's top-level code (this very loop) to run first, in
 * full, before archive.page.mjs's build() is ever reached. That holds
 * regardless of which of the two files the directory walk happens to import
 * first, and regardless of directory order generally: whichever eventos/
 * page module is imported first will drag this module's top-level code in
 * with it. Registering routes here is therefore the one placement that is
 * guaranteed correct without depending on file-system iteration order.
 *
 * Per event.schema.json's own documentation of `status`, "'draft' never
 * renders" — so a draft event gets no route and no public detail page.
 * listableEvents() below applies the same rule for listings; keeping both
 * checks in sync is why this loop reads data.events.items directly rather
 * than duplicating the filter differently.
 * ------------------------------------------------------------------------- */
for (const ev of data.events.items) {
  if (ev.status === 'draft') continue;
  registerRoute(ev.id, { es: `eventos/${ev.id}`, it: `eventi/${ev.id}` });
}

/* ---------------------------------------------------------------------------
 * Icons — 24x24, stroke 1.5, matching 1streview/AIS Eventos.dc.html and
 * AIS Evento Detalle.dc.html exactly. Colour is a token reference
 * (`var(--siena)` etc.), never a raw hex, so tokens.css stays the single
 * source of colour. `currentColor` is used where the icon should inherit
 * its container's ink instead of forcing siena.
 * ------------------------------------------------------------------------- */

const ICON_PATH = {
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  calendar: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M3 10h18"/>',
  calendarPlus: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M12 12v5M9.5 14.5h5"/>',
  language: '<path d="m5 8 6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6"/>',
  ticket: '<path d="M2 9V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2a3 3 0 0 0 0 6v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2a3 3 0 0 0 0-6Z"/><path d="M13 5v14"/>',
  download: '<path d="M12 17V3M7 8l5-5 5 5" transform="rotate(180 12 10)"/><path d="M20 17v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2"/>',
  instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/>',
  facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
  send: '<path d="m22 2-7 20-4-9-9-4Z"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
};

export function icon(name, { size = 20, color = 'var(--siena)', strokeWidth = 1.5 } = {}) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATH[name]}</svg>`;
}

/* ---------------------------------------------------------------------------
 * UI strings for the events tree.
 *
 * Spanish is copied verbatim from AIS Eventos.dc.html / AIS Evento
 * Detalle.dc.html wherever the artboards cover the string. Italian has no
 * artboard of its own in this batch (only the ES screens were exported), so
 * every IT line is new copy in the same dry register — marked NEW and
 * listed as unvalidated in IMPLEMENTATION-LOG.md, exactly as
 * build/pages/README.md rule 5 asks for. A handful of ES strings are also
 * new (no artboard covers the archive/series/empty states in ES either) —
 * those are marked NEW too.
 * ------------------------------------------------------------------------- */

export const T = {
  es: {
    calendarTitle: 'Calendario',
    calendarLead: 'Todo lo que organiza la asociación: encuentros, excursiones, cine, cocina y la Feria de Italia. Casi todo es gratuito y abierto.',
    whenLegend: 'Cuándo',
    whenUpcoming: 'Próximos',
    whenAll: 'Todos',
    seriesLegend: 'Serie',
    seriesAll: 'Todas',
    langLegend: 'Idioma',
    langIt: 'Italiano',
    langEs: 'Español',
    langBoth: 'Bilingüe',
    clearFilters: 'Quitar filtros',
    sortLabel: 'Ordenar:',
    sortValue: 'fecha más cercana',
    countUpcomingOne: '{n} evento próximo',
    countUpcomingMany: '{n} eventos próximos',
    countAllOne: '{n} evento',
    countAllMany: '{n} eventos',
    archiveTitle: 'Archivo',
    archiveSubtitle: 'Quince años de actividad',                          // NEW
    archiveViewAll: 'Ver todo el archivo',                                // NEW
    archiveLead: 'Eventos ya celebrados por la asociación.',              // NEW
    emptyFilterTitle: 'Ningún evento con estos filtros',                  // NEW
    emptyFilterText: 'Prueba a quitar algún filtro o consulta el archivo completo.', // NEW
    emptySeriesTitle: 'Todavía no hay actividades programadas',           // NEW
    emptySeriesText: 'Síguenos en Instagram para enterarte en cuanto haya novedades.', // NEW
    followInstagram: 'Seguir en Instagram',                               // NEW
    dateTbd: 'Fecha por confirmar',                                       // NEW
    priceUnpublished: 'Precio no publicado',                              // NEW
    freeEntry: 'Entrada gratuita',                                        // NEW (numeric fallback when price=0 but no JSON note)
    membersOnly: 'Solo socios',                                           // verbatim, index artboard card 3
    downloadPoster: 'Descargar el cartel',
    addToCalendar: 'Añadir al calendario',
    share: 'Compartir',
    shareFacebook: 'Compartir en Facebook',                               // NEW
    shareEmail: 'Compartir por correo',                                   // NEW
    followInstagramLabel: 'Seguir a AIS en Instagram',                    // NEW
    programTitle: 'Programa',
    fechas: 'Fechas',
    donde: 'Dónde',
    idioma: 'Idioma',
    precio: 'Precio',
    organizan: 'Organizan',
    conElAvalDe: 'Con el aval de',
    patrocinan: 'Patrocinan',
    joinCtaFeriaTitle: '¿Vienes a la Feria y aún no eres socio?',
    joinCtaFeriaText: 'La cuota sostiene el montaje, los artistas y los talleres para las familias.',
    joinCtaGenericTitle: '¿Aún no eres socio?',                          // NEW, adapted from the Feria CTA
    joinCtaGenericText: 'La cuota sostiene los encuentros y las actividades de la asociación.', // NEW
    joinCta: 'Hazte socio',
    registerEventbrite: 'Reservar entrada en Eventbrite',
    registerEmail: 'Inscribirse por email',                              // NEW
    galleryTitle: 'Galería',                                              // verbatim, same pair as nav.json's "gallery" label
    both: 'IT + ES',
    home: 'Inicio',
    editionLabel: (edition) => `Feria de Italia · ${edition} edición`,
    seriesIntro: {
      'feria-de-italia': null, // uses events.json series[].description
      'ais-bambini': 'Actividades en italiano pensadas para niños y familias.', // NEW, adapted from series description
      'incontri-letterari': 'Lecturas y encuentros sobre literatura italiana.', // NEW
    },
  },
  it: {
    calendarTitle: 'Calendario',                                                              // NEW
    calendarLead: 'Tutto ciò che organizza l’associazione: incontri, escursioni, cinema, cucina e la Feria de Italia. Quasi tutto è gratuito e aperto.', // NEW
    whenLegend: 'Quando',                                                                      // NEW
    whenUpcoming: 'Prossimi',                                                                  // NEW
    whenAll: 'Tutti',                                                                          // NEW
    seriesLegend: 'Serie',                                                                     // NEW
    seriesAll: 'Tutte',                                                                        // NEW
    langLegend: 'Lingua',                                                                      // NEW
    langIt: 'Italiano',                                                                        // NEW
    langEs: 'Spagnolo',                                                                        // NEW
    langBoth: 'Bilingue',                                                                      // NEW
    clearFilters: 'Rimuovi filtri',                                                            // NEW
    sortLabel: 'Ordina:',                                                                      // NEW
    sortValue: 'data più vicina',                                                              // NEW
    countUpcomingOne: '{n} evento in programma',                                               // NEW
    countUpcomingMany: '{n} eventi in programma',                                              // NEW
    countAllOne: '{n} evento',                                                                 // NEW
    countAllMany: '{n} eventi',                                                                // NEW
    archiveTitle: 'Archivio',                                                                  // NEW
    archiveSubtitle: 'Quindici anni di attività',                                               // NEW
    archiveViewAll: 'Vedi tutto l’archivio',                                                // NEW
    archiveLead: 'Eventi già svolti dall’associazione.',                                    // NEW
    emptyFilterTitle: 'Nessun evento con questi filtri',                                        // NEW
    emptyFilterText: 'Prova a togliere un filtro o consulta l’archivio completo.',           // NEW
    emptySeriesTitle: 'Non ci sono ancora attività in programma',                               // NEW
    emptySeriesText: 'Seguici su Instagram per essere aggiornato sulle novità.',                 // NEW
    followInstagram: 'Segui su Instagram',                                                      // NEW
    dateTbd: 'Data da confermare',                                                              // NEW
    priceUnpublished: 'Prezzo non pubblicato',                                                  // NEW
    freeEntry: 'Ingresso gratuito',                                                             // NEW
    membersOnly: 'Solo soci',                                                                   // NEW
    downloadPoster: 'Scarica la locandina',                                                     // NEW
    addToCalendar: 'Aggiungi al calendario',                                                    // NEW
    share: 'Condividi',                                                                         // NEW
    shareFacebook: 'Condividi su Facebook',                                                     // NEW
    shareEmail: 'Condividi via email',                                                          // NEW
    followInstagramLabel: 'Segui AIS su Instagram',                                             // NEW
    programTitle: 'Programma',                                                                  // NEW
    fechas: 'Date',                                                                             // NEW
    donde: 'Dove',                                                                              // NEW
    idioma: 'Lingua',                                                                           // NEW
    precio: 'Prezzo',                                                                           // NEW
    organizan: 'Organizzano',                                                                   // NEW
    conElAvalDe: 'Con il patrocinio di',                                                        // NEW
    patrocinan: 'Sponsorizzano',                                                                // NEW
    joinCtaFeriaTitle: 'Vieni alla Feria e non sei ancora socio?',                               // NEW
    joinCtaFeriaText: 'La quota sostiene l’allestimento, gli artisti e i laboratori per le famiglie.', // NEW
    joinCtaGenericTitle: 'Non sei ancora socio?',                                                // NEW
    joinCtaGenericText: 'La quota sostiene gli incontri e le attività dell’associazione.',    // NEW
    joinCta: 'Associati',
    registerEventbrite: 'Prenota il biglietto su Eventbrite',                                   // NEW
    registerEmail: 'Iscriviti via email',                                                       // NEW
    both: 'IT + ES',
    home: 'Home',
    editionLabel: (edition) => `Feria de Italia · ${edition} edizione`,                         // NEW
    seriesIntro: {
      'feria-de-italia': null,
      'ais-bambini': 'Attività in italiano pensate per bambini e famiglie.',                    // NEW
      'incontri-letterari': 'Letture e incontri sulla letteratura italiana.',                   // NEW
    },
  },
};

/* ---------------------------------------------------------------------------
 * Date handling — tolerant of the TODO placeholders in events.json.
 *
 * Never fills in a missing year/month/day/hour: a component that cannot be
 * read from the string stays null. Callers decide how to render "unknown"
 * (usually T.dateTbd) instead of a fabricated value.
 * ------------------------------------------------------------------------- */

const MONTH_LONG = {
  es: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  it: ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'],
};
const MONTH_ABBR = {
  es: ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'],
  it: ['GEN', 'FEB', 'MAR', 'APR', 'MAG', 'GIU', 'LUG', 'AGO', 'SET', 'OTT', 'NOV', 'DIC'],
};
const WEEKDAY_LONG = {
  es: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  it: ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'],
};

export const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const pad2 = (n) => String(n).padStart(2, '0');

/** Parse an ISO-ish local datetime, tolerating "2026-09-TODO T19:00" etc. */
export function parseEventDate(raw) {
  const empty = { raw: raw ?? null, year: null, month: null, day: null, hour: null, minute: null, hasDate: false, hasTime: false, date: null };
  if (!raw || typeof raw !== 'string') return empty;
  const dm = raw.match(/(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/);
  const tm = raw.match(/(\d{2}):(\d{2})/);
  const year = dm?.[1] ? Number(dm[1]) : null;
  const month = dm?.[2] ? Number(dm[2]) : null;
  const day = dm?.[3] ? Number(dm[3]) : null;
  const hour = tm ? Number(tm[1]) : null;
  const minute = tm ? Number(tm[2]) : null;
  const hasDate = Boolean(year && month && day);
  const hasTime = Boolean(tm);
  const date = hasDate ? new Date(year, month - 1, day, hour ?? 0, minute ?? 0) : null;
  return { raw, year, month, day, hour, minute, hasDate, hasTime, date };
}

/** A best-effort Date for SORTING only — never shown to a visitor. Falls
 *  back to the last plausible day of a known year/month so an event with an
 *  unconfirmed day still sorts near the right place, without ever being
 *  displayed as that fabricated day. */
function sortableDate(ev) {
  const p = parseEventDate(ev.end || ev.start);
  if (p.date) return p.date;
  if (p.year) return new Date(p.year, (p.month ?? 12) - 1, p.day ?? 28);
  return new Date(0);
}

/** schema.org / events.json status, with the auto-flip the schema documents:
 *  a 'published' event whose end (or start) has passed renders as 'past'.
 *  'draft' and 'cancelled' pass through unchanged. */
export function effectiveStatus(ev, now = new Date()) {
  if (ev.status !== 'published') return ev.status;
  const end = parseEventDate(ev.end || ev.start);
  if (end.date && end.date < now) return 'past';
  return 'published';
}

export function listableEvents() {
  return data.events.items.filter((ev) => ev.status !== 'draft');
}
export function upcomingEvents() {
  return listableEvents().filter((ev) => effectiveStatus(ev) === 'published').sort((a, b) => sortableDate(a) - sortableDate(b));
}
export function pastEvents() {
  return listableEvents().filter((ev) => effectiveStatus(ev) === 'past').sort((a, b) => sortableDate(b) - sortableDate(a));
}

/** "26" / "SEP" for the round date badge on a card. Null when the day is
 *  not known — callers must omit the badge rather than guess a day. */
export function cardDateBadge(ev, locale) {
  const p = parseEventDate(ev.start);
  if (!p.hasDate) return null;
  return { day: String(p.day), month: MONTH_ABBR[locale][p.month - 1] };
}

/** The one-line meta under a card title ("Sevilla · 19:00", "Sevilla · 26 y
 *  27 de octubre"...). Degrades to T.dateTbd (plus a known time fragment, if
 *  any) rather than inventing the missing piece. */
export function cardMetaLine(ev, locale) {
  const t = T[locale];
  const start = parseEventDate(ev.start);
  const end = parseEventDate(ev.end);
  const locality = ev.venue?.locality ?? '';
  if (!start.hasDate) {
    const timeFrag = start.hasTime ? ` · ${pad2(start.hour)}:${pad2(start.minute)}` : '';
    return `${t.dateTbd}${timeFrag}`;
  }
  if (ev.allDay) {
    const monthLong = MONTH_LONG[locale][start.month - 1];
    if (end.hasDate && (end.day !== start.day || end.month !== start.month)) {
      const joiner = locale === 'es' ? 'y' : 'e';
      const prep = locale === 'es' ? 'de ' : '';
      return `${locality} · ${start.day} ${joiner} ${end.day} ${prep}${monthLong}`;
    }
    const prep = locale === 'es' ? 'de ' : '';
    return `${locality} · ${start.day} ${prep}${monthLong}`;
  }
  if (start.hasTime) return `${locality} · ${pad2(start.hour)}:${pad2(start.minute)}`;
  return locality;
}

/** Full "Fechas" block for the detail page info-grid, e.g.
 *  "Sábado 26 y domingo 27 de octubre<br>De 11:30 a 18:00". Sentence-case
 *  only the first word, matching the artboard. */
export function detailDatesHTML(ev, locale) {
  const t = T[locale];
  const start = parseEventDate(ev.start);
  const end = parseEventDate(ev.end);
  if (!start.hasDate) {
    const timeFrag = start.hasTime ? ` · ${pad2(start.hour)}:${pad2(start.minute)}` : '';
    return esc(`${t.dateTbd}${timeFrag}`);
  }
  const wd = (p) => WEEKDAY_LONG[locale][new Date(p.year, p.month - 1, p.day).getDay()];
  const monthLong = MONTH_LONG[locale][start.month - 1];
  const prep = locale === 'es' ? 'de ' : '';
  let dateLine;
  if (end.hasDate && (end.day !== start.day || end.month !== start.month)) {
    const joiner = locale === 'es' ? 'y' : 'e';
    dateLine = `${wd(start)} ${start.day} ${joiner} ${wd(end)} ${end.day} ${prep}${monthLong}`;
  } else {
    dateLine = `${wd(start)} ${start.day} ${prep}${monthLong}`;
  }
  dateLine = cap(dateLine);
  let timeLine = '';
  if (start.hasTime) {
    if (end.hasTime) {
      timeLine = locale === 'es' ? `De ${pad2(start.hour)}:${pad2(start.minute)} a ${pad2(end.hour)}:${pad2(end.minute)}` : `Dalle ${pad2(start.hour)}:${pad2(start.minute)} alle ${pad2(end.hour)}:${pad2(end.minute)}`;
    } else {
      timeLine = locale === 'es' ? `A las ${pad2(start.hour)}:${pad2(start.minute)}` : `Alle ${pad2(start.hour)}:${pad2(start.minute)}`;
    }
  }
  return esc(dateLine) + (timeLine ? `<br>${esc(timeLine)}` : '');
}

/** Weekday chip label for the programme day-switcher, e.g. "Sábado 26". */
export function dayChipLabel(dayIso, locale) {
  const p = parseEventDate(dayIso);
  if (!p.hasDate) return esc(dayIso);
  const wd = WEEKDAY_LONG[locale][new Date(p.year, p.month - 1, p.day).getDay()];
  return esc(cap(`${wd} ${p.day}`));
}

/* ---------------------------------------------------------------------------
 * Language, price and card markup
 * ------------------------------------------------------------------------- */

export function languageTag(languages, locale) {
  const t = T[locale];
  if (!languages?.length) return '';
  if (languages.length > 1) return t.both;
  return languages[0].toUpperCase();
}

/** { kind: 'sticker'|'plain', text } for the pill next to the language tag,
 *  or null when there is nothing to show. price.note from events.json wins
 *  over any generated text — it is the structured, per-event source. */
export function priceBadge(ev, locale) {
  const t = T[locale];
  const price = ev.price;
  if (!price) return null;
  if (price.note?.[locale]) return { kind: 'sticker', text: price.note[locale] };
  if (price.public === 0 || price.members === 0) return { kind: 'sticker', text: t.freeEntry };
  if (price.public == null && price.members == null) return { kind: 'plain', text: t.membersOnly };
  return null;
}

/** "Precio" field on the detail page — same source priority as priceBadge,
 *  falls back to an honest "not published" note rather than a blank field. */
export function priceLine(ev, locale) {
  const t = T[locale];
  const price = ev.price;
  if (price?.note?.[locale]) return price.note[locale];
  if (price?.public === 0 || price?.members === 0) return t.freeEntry;
  if (typeof price?.public === 'number' && price.public > 0) {
    return locale === 'es' ? `Desde ${price.public} €` : `A partire da ${price.public} €`;
  }
  return t.priceUnpublished;
}

/** The 4:5 poster image, shared between the card grid (alt="", decorative —
 *  the title sits next to it as real text) and detail.page.mjs's hero
 *  poster (a real, descriptive alt — it is the only image on that page). */
export function posterImg(src, alt, { eager = false } = {}) {
  const loadAttr = eager ? ' decoding="async"' : ' loading="lazy" decoding="async"';
  return `<img src="${esc(src || '/assets/img/og-default.png')}" alt="${esc(alt)}" width="640" height="800"${loadAttr}>`;
}

export function seriesLabel(seriesId, locale) {
  const s = data.events.series.find((x) => x.id === seriesId);
  return s ? s.label[locale] : seriesId;
}

/** events.json series id -> the nav/route id of that series' landing page,
 *  for series that have one (feria, ais-bambini, incontri-letterari). The
 *  other series (escursioni, cineforum, cucina, aperitivi, istituzionale)
 *  have no landing page yet, so detail.page.mjs's breadcrumb simply omits
 *  that level for them rather than linking somewhere invented. */
export const SERIES_ROUTE = {
  'feria-de-italia': 'feria',
  'ais-bambini': 'bambini',
  'incontri-letterari': 'letterari',
};

/** A patron/sponsor name pill, exactly as drawn in the "Patrocinan" block of
 *  AIS Evento Detalle.dc.html (white pill, --indaco ink — AAA on white, safe
 *  for text unlike the decorative tricolore greens/coral). Shared with
 *  patrocinio.page.mjs, which shows the same names as social proof. */
export function sponsorPillHTML(name) {
  return `<span style="background:var(--bianco);border:1px solid var(--linea);border-radius:var(--r-sm);padding:12px 18px;font:600 15px/1 var(--font-ui);color:var(--indaco)">${esc(name)}</span>`;
}

/**
 * One event card. `compact` reproduces the smaller archive-card treatment
 * (date range + series as a single label line, 22px title, no sticker/tag
 * row) from the "Archivo" section of AIS Eventos.dc.html; otherwise this is
 * the 3-up upcoming-grid card (26px title, date badge, language + price
 * pills). Carries data-* attributes filters.js reads to filter client-side.
 */
export function eventCardHTML(ev, locale, { compact = false, eager = false } = {}) {
  const t = T[locale];
  const url = routeOf(ev.id, locale);
  const title = ev.title[locale];
  const badge = cardDateBadge(ev, locale);
  const langs = (ev.language ?? []).join(',');

  if (compact) {
    const start = parseEventDate(ev.start);
    const end = parseEventDate(ev.end);
    let dateLabel;
    if (!start.hasDate) {
      dateLabel = t.dateTbd;
    } else if (end.hasDate && (end.day !== start.day || end.month !== start.month)) {
      dateLabel = `${start.day}–${end.day} ${MONTH_ABBR[locale][start.month - 1].toLowerCase()} ${start.year}`;
    } else {
      dateLabel = `${start.day} ${MONTH_ABBR[locale][start.month - 1].toLowerCase()} ${start.year}`;
    }
    return `<a class="card" href="${url}" style="box-shadow:none" data-event-card data-series="${esc(ev.series)}" data-lang="${esc(langs)}" data-when="past">
        <div class="card-event__media">${posterImg(ev.poster, '', { eager })}</div>
        <div class="card__body">
          <div class="u-label">${esc(dateLabel)} · ${esc(seriesLabel(ev.series, locale))}</div>
          <h3 class="card__title">${esc(title)}</h3>
          <div class="u-small">${esc(ev.venue?.locality ?? '')}</div>
        </div>
      </a>`;
  }

  const badgeHTML = badge
    ? `<div style="position:absolute;top:16px;left:16px;background:var(--bianco);border-radius:var(--r-sm);padding:8px 12px;text-align:center;box-shadow:0 1px 2px rgba(121,52,33,.06);pointer-events:none">
          <div style="font:600 26px/1 var(--font-display);font-variation-settings:var(--fraunces-vars);color:var(--siena)">${esc(badge.day)}</div>
          <div class="u-label" style="margin-top:2px">${esc(badge.month)}</div>
        </div>`
    : '';
  const price = priceBadge(ev, locale);
  const priceHTML = price
    ? price.kind === 'sticker'
      ? `<span class="sticker">${esc(price.text)}</span>`
      : `<span style="font:600 15px/1.55 var(--font-ui);color:var(--inchiostro)">${esc(price.text)}</span>`
    : '';
  const when = effectiveStatus(ev) === 'past' ? 'past' : 'upcoming';

  return `<a class="card" href="${url}" data-event-card data-series="${esc(ev.series)}" data-lang="${esc(langs)}" data-when="${when}">
      <div class="card-event__media">
        ${posterImg(ev.poster, '', { eager })}
        ${badgeHTML}
      </div>
      <div class="card__body">
        <div class="u-label u-label--siena">${esc(seriesLabel(ev.series, locale))}</div>
        <h3 class="card__title" style="font-size:26px;line-height:1.25">${esc(title)}</h3>
        <div class="card__meta">${icon('pin')}<span>${esc(cardMetaLine(ev, locale))}</span></div>
        <div class="card__tags">
          <span class="tag tag--lang">${esc(languageTag(ev.language, locale))}</span>
          ${priceHTML}
        </div>
      </div>
    </a>`;
}

/* ---------------------------------------------------------------------------
 * Filter rail — index page only. Real events always ship in the markup
 * (see build()); filters.js only ever toggles `hidden`, so a visitor with
 * JavaScript disabled still gets every event, unfiltered and readable.
 * ------------------------------------------------------------------------- */

const RAIL_SERIES = ['feria-de-italia', 'ais-bambini', 'incontri-letterari', 'escursioni', 'cineforum', 'cucina', 'aperitivi'];

export function filterRailHTML(locale) {
  const t = T[locale];
  const seriesChips = RAIL_SERIES.map((id) =>
    `<button type="button" class="chip" aria-pressed="false" data-series-option="${esc(id)}">${esc(seriesLabel(id, locale))}</button>`
  ).join('\n          ');

  return `<aside class="card" style="box-shadow:none;padding:24px;display:flex;flex-direction:column;gap:24px" data-filter-rail>
      <fieldset style="border:0;padding:0;margin:0">
        <legend class="u-label" style="margin-bottom:14px">${esc(t.whenLegend)}</legend>
        <div class="lang-toggle" data-when-toggle>
          <a href="?when=upcoming" data-when-option="upcoming" aria-current="true">${esc(t.whenUpcoming)}</a>
          <a href="?when=all" data-when-option="all">${esc(t.whenAll)}</a>
        </div>
      </fieldset>
      <fieldset style="border:0;padding:0;margin:0">
        <legend class="u-label" style="margin-bottom:14px">${esc(t.seriesLegend)}</legend>
        <div style="display:flex;flex-wrap:wrap;gap:8px" data-series-group>
          <button type="button" class="chip" aria-pressed="true" data-series-option="all">${esc(t.seriesAll)}</button>
          ${seriesChips}
        </div>
      </fieldset>
      <fieldset style="border:0;padding:0;margin:0">
        <legend class="u-label" style="margin-bottom:14px">${esc(t.langLegend)}</legend>
        <div style="display:flex;flex-direction:column;gap:12px" data-lang-group>
          <label class="check"><input type="checkbox" value="it" data-lang-option><span class="check__box">${icon('check', { size: 14, color: 'var(--bianco)', strokeWidth: 3 })}</span><span class="check__text">${esc(t.langIt)}</span></label>
          <label class="check"><input type="checkbox" value="es" data-lang-option><span class="check__box">${icon('check', { size: 14, color: 'var(--bianco)', strokeWidth: 3 })}</span><span class="check__text">${esc(t.langEs)}</span></label>
          <label class="check"><input type="checkbox" value="both" data-lang-option><span class="check__box">${icon('check', { size: 14, color: 'var(--bianco)', strokeWidth: 3 })}</span><span class="check__text">${esc(t.langBoth)}</span></label>
        </div>
      </fieldset>
      <div style="border-top:1px solid var(--linea);padding-top:20px">
        <button type="button" class="btn btn--ghost btn--ghost-ruled" style="padding-left:0;padding-right:0" data-clear-filters>${esc(t.clearFilters)}</button>
      </div>
    </aside>`;
}

export function emptyStateHTML(locale, { title, text, cta } = {}) {
  return `<div class="empty">
      <img class="empty__mark" src="/assets/img/giralda.png" alt="" width="72" height="72">
      <p class="empty__title">${esc(title)}</p>
      <p class="empty__text">${esc(text)}</p>
      ${cta ?? ''}
    </div>`;
}

/* ---------------------------------------------------------------------------
 * Pagination — generic, so it only ever renders links that lead somewhere.
 * With today's 3 archived events and a sane page size this yields a single
 * page and no pagination nav at all, by design: a "2" that has nothing
 * behind it would be a fabricated control, not a real one.
 * ------------------------------------------------------------------------- */

export function paginate(items, perPage) {
  const pages = [];
  for (let i = 0; i < items.length; i += perPage) pages.push(items.slice(i, i + perPage));
  return pages.length ? pages : [[]];
}

export function paginationHTML(current, total, pageUrl) {
  if (total <= 1) return '';
  const items = [];
  for (let n = 1; n <= total; n += 1) {
    items.push(n === current
      ? `<li><span aria-current="page">${n}</span></li>`
      : `<li><a href="${esc(pageUrl(n))}">${n}</a></li>`);
  }
  const next = current < total
    ? `<li><a href="${esc(pageUrl(current + 1))}" aria-label="Siguiente">${icon('chevronDown', { size: 20 })}</a></li>`
    : '';
  return `<nav class="pagination" aria-label="Paginación"><ul>${items.join('')}${next}</ul></nav>`;
}

/* ---------------------------------------------------------------------------
 * Breadcrumb — visible nav (this codebase's renderPage only turns
 * page.breadcrumb into BreadcrumbList JSON-LD, it never prints the HTML)
 * plus the trail array to hand back to renderPage for that JSON-LD.
 * ------------------------------------------------------------------------- */

export function breadcrumb(locale, trail) {
  const items = trail.map((c, i) => i === trail.length - 1
    ? `<li><span aria-current="page">${esc(c.label)}</span></li>`
    : `<li><a href="${c.href}">${esc(c.label)}</a></li>`).join('');
  return `<nav class="breadcrumb" aria-label="${esc(T[locale].home)}"><ol>${items}</ol></nav>`;
}

export function baseTrail(locale) {
  const t = T[locale];
  const eventsLabel = data.nav.primary.find((i) => i.id === 'events').label[locale];
  return [
    { label: t.home, href: routeOf('home', locale) },
    { label: eventsLabel, href: routeOf('events', locale) },
  ];
}

/* ---------------------------------------------------------------------------
 * /eventos/ and /eventi/ — the calendar itself
 * ------------------------------------------------------------------------- */

function countLabel(n, locale, upcoming) {
  const t = T[locale];
  const tpl = upcoming ? (n === 1 ? t.countUpcomingOne : t.countUpcomingMany) : (n === 1 ? t.countAllOne : t.countAllMany);
  return tpl.replace('{n}', n);
}

export default {
  id: 'events-index',
  async build() {
    for (const locale of LOCALES) {
      const t = T[locale];
      const alternates = routes.get('events');
      const upcoming = upcomingEvents();
      const past = pastEvents();
      const archiveTeaser = past.slice(0, 3);
      const archiveUrl = routeOf('archive', locale);

      const upcomingCards = upcoming.map((ev, i) => eventCardHTML(ev, locale, { eager: i === 0 })).join('\n          ');
      const archiveCards = archiveTeaser.map((ev) => eventCardHTML(ev, locale, { compact: true })).join('\n            ');

      const body = `
<div class="wrap" style="padding-top:24px">
  ${breadcrumb(locale, [{ label: t.home, href: routeOf('home', locale) }, { label: data.nav.primary.find((i) => i.id === 'events').label[locale], href: '' }])}
</div>
<div class="wrap" style="padding-top:16px;padding-bottom:0">
  <span class="tricolore" aria-hidden="true"><i></i><i></i><i></i></span>
  <h1 style="margin-top:16px">${esc(t.calendarTitle)}</h1>
  <p class="u-lead">${esc(t.calendarLead)}</p>
</div>
<div class="wrap" style="padding-top:40px;padding-bottom:96px;display:flex;flex-wrap:wrap;gap:48px;align-items:flex-start">
  <div style="flex:1 1 260px">
    ${filterRailHTML(locale)}
  </div>
  <div style="flex:999 1 480px;min-width:0">
    <div style="display:flex;align-items:baseline;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:24px">
      <div class="u-label" data-event-count data-count-upcoming-one="${esc(t.countUpcomingOne)}" data-count-upcoming-many="${esc(t.countUpcomingMany)}" data-count-all-one="${esc(t.countAllOne)}" data-count-all-many="${esc(t.countAllMany)}">${esc(countLabel(upcoming.length, locale, true))}</div>
      <div style="display:flex;align-items:center;gap:8px;font:500 15px/1 var(--font-ui);color:var(--grigio)">${esc(t.sortLabel)} <span style="color:var(--siena);font-weight:600">${esc(t.sortValue)}</span></div>
    </div>
    <div class="grid grid--3" data-event-grid>
      ${upcomingCards}
    </div>
    <div hidden data-empty-filter>
      ${emptyStateHTML(locale, { title: t.emptyFilterTitle, text: t.emptyFilterText })}
    </div>

    ${archiveTeaser.length ? `<div style="margin-top:80px;padding-top:40px;border-top:1px solid var(--linea)">
      <div style="display:flex;align-items:baseline;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:24px">
        <h2>${esc(t.archiveTitle)}</h2>
        <div class="u-small">${esc(t.archiveSubtitle)}</div>
      </div>
      <div class="grid grid--3">
        ${archiveCards}
      </div>
      <p style="margin-top:32px"><a class="btn btn--secondary" href="${archiveUrl}">${esc(t.archiveViewAll)}</a></p>
    </div>` : ''}
  </div>
</div>`;

      writePage(alternates[locale], renderPage({
        locale,
        alternates,
        activeNav: 'events',
        title: `${t.calendarTitle} — ${data.site.org.legalName}`,
        description: t.calendarLead,
        breadcrumb: [{ label: t.home, href: routeOf('home', locale) }, { label: data.nav.primary.find((i) => i.id === 'events').label[locale], href: alternates[locale] }],
        scripts: ['/assets/js/filters.js'],
        body,
      }));
    }
  },
};
