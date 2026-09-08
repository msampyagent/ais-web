# PROMPT PER CLAUDE CODE — Costruzione del sito italianiasiviglia.com

> Copia tutto quello che sta sotto la riga e incollalo come primo messaggio in Claude Code, con la cartella `ais-web/` aperta come working directory.
> Modello consigliato: **Sonnet, thinking alto**. Il lavoro è parallelizzabile: il prompt è già organizzato in agenti concorrenti con confini di file espliciti, così non si pestano i piedi.

---

## CONTESTO

Devi costruire il sito della **Asociación Italiani a Siviglia (AIS)**, l'associazione degli italiani di Siviglia, fondata il 14 febbraio 2010. Il sito è **bilingue spagnolo/italiano**, con lo spagnolo come lingua di default.

Il design è **già fatto e approvato**. Non devi inventare nulla di visivo. Nella cartella `1streview/` trovi undici artboard HTML che sono la fonte di verità assoluta per colori, tipografia, spaziature, componenti e microcopy. Il tuo compito è trasformarli in un sito reale, statico, veloce e con un SEO solido.

### Cosa c'è in `1streview/`

| File | Contenuto |
|---|---|
| `AIS Index.dc.html` | Indice degli artboard — solo per orientarti, non è una pagina del sito |
| `AIS Style Tile.dc.html` | **Il documento più importante.** Palette con i ratio di contrasto misurati, scala tipografica completa, stati dei bottoni, risorse grafiche, sombras |
| `AIS Navegacion.dc.html` | Header in riposo (72px) e compresso allo scroll (60px), pannello dropdown "Eventos", footer, banner cookie, menu mobile aperto in ES e IT |
| `AIS Home.dc.html` | Home desktop 1440 in spagnolo + home mobile 390 in italiano, nove sezioni |
| `AIS Convenios.dc.html` | Indice convenzioni desktop + mobile, con i cinque partner reali |
| `AIS Hazte Partner.dc.html` | Form partner: desktop vuoto / compilato / inviato, mobile IT vuoto e inviato |
| `AIS Eventos.dc.html` | Calendario con rail filtri, griglia 3-up, archivio, paginazione. Desktop + mobile |
| `AIS Evento Detalle.dc.html` | Scheda evento con locandina sticky e il programma completo di 13 appuntamenti della IX Feria |
| `AIS Equipo y Colabora.dc.html` | Giunta direttiva + pagina volontariato + stato "nessuna vacanza aperta" |
| `AIS Guia Practica.dc.html` | Articolo lungo: indice sticky, colonna da 720px, callout link ufficiali, accordion FAQ |
| `AIS Componentes.dc.html` | Bottoni e campi nei quattro stati, le quattro card, tira de confianza, breadcrumb, avvisi |

Ogni artboard è un file autonomo: apri con `open` o leggi il sorgente. Sono **inline-styled**, senza foglio di stile: ogni valore di design è leggibile direttamente sull'elemento. Ignora `support.js` e i tag `<x-dc>` / `<helmet>` / `<image-slot>` — sono l'impalcatura dello strumento di design, non fanno parte del sito da costruire.

### Dati reali

`1streview/brief/data/*.json` contiene i dati veri, già strutturati: `events.json`, `convenios.json`, `team.json`, `news.json`, `careers.json`, `forms.json`, `nav.json`, `schemas.json`, `site.json`. **Usa questi file come sorgente di contenuto.** I nomi in `team.json` sono placeholder dichiarati — lasciali placeholder, non inventare persone.

### Asset

`1streview/assets/` — `ais-logo.png`, `ais-wordmark.png`, `giralda.png` (contorno della Giralda con sfondo trasparente, usato come watermark e come bullet), `partners/*.png` (cinque loghi reali), `ig/*.png` (locandine Instagram originali).

**Manca `sevilla-italia.png`**, l'illustrazione dello skyline dell'hero. Negli artboard è un placeholder. Nel sito mettici un `<div>` con sfondo `--avorio` e un `<img>` commentato pronto da sostituire, e segnalamelo nel report finale.

---

## SISTEMA DI DESIGN — estrai i valori, non inventarli

Leggi `AIS Style Tile.dc.html` e `AIS Componentes.dc.html` **prima di scrivere una riga di CSS**, e da lì costruisci `assets/css/tokens.css`. Per riferimento rapido, questi sono i valori che troverai — ma verifica sempre sul file, il file vince:

```
Fondi:      --crema #F9F9ED · --avorio #FEEED6 · --sabbia #FEC191 · --bianco #FFFFFF
Inchiostro: --siena #793421 · --indaco #342B5D · --inchiostro #1C1917 · --grigio #5C544C
Tricolore:  --verde #1E7A3C · --rosso #C81E20 (testo OK)
            --verde-vivo #35972B · --verde-illu #019E48 · --corallo #F84446 (solo decorativi)
Linea:      rgba(121,52,33,.14) — bordi e divisori
Bordo forte:rgba(121,52,33,.28) — input, tratteggi
Raggi:      8px controlli · 16px card · 28px pannelli
Sombras:    sh-1  0 1px 2px rgba(121,52,33,.06), 0 2px 8px rgba(121,52,33,.05)
            sh-2  0 4px 12px rgba(121,52,33,.08), 0 12px 32px rgba(121,52,33,.07)
Tipografia: Fraunces (display, SOFT 40 WONK 1) · Inter (UI e corpo) · Caveat Brush (adesivi)
Scala:      display 72 · h1 52 · h2 38 · h3 26 · h4 20 · lead 21 · body 17 · small 15 · label 13
Mobile:     h1 34/40 · h2 28 · h3 22 · body 18/16
Griglia:    margine 72px desktop, 20px mobile · gap 32px · colonna testo max 720px
```

### Regole non negoziabili, verificate in fase di design

1. **Mai opacità su un blocco che contiene testo di corpo.** Per togliere peso si cambia il colore di inchiostro (`--grigio`) o il fondo della card (`#F1EBE3`). Questa regola è documentata in `AIS Componentes.dc.html` — rispettala.
2. **La regola tricolore** (la barretta verde/bianco/rosso da 96×3px) porta sempre un filetto `box-shadow: 0 0 0 .5px rgba(121,52,33,.28)`, altrimenti il segmento bianco sparisce sul crema.
3. **Contrasto minimo 4.5:1** per il testo, 3:1 solo per la scala titolo. I ratio misurati sono annotati nello style tile. `--verde-vivo`, `--verde-illu` e `--corallo` non si usano mai per il testo.
4. **Target tattili minimo 44px** su mobile; input alti 48px minimo con etichetta sempre visibile sopra il campo.
5. **Errori di form**: colore *più* icona, mai solo colore.
6. **Focus visibile** su tutto: `outline: 2px solid var(--indaco); outline-offset: 2px`.
7. Massimo due colori di fondo per pagina. Le sezioni alternano `--crema` e `--avorio`; `--indaco` è il fondo dei blocchi forti (Feria, footer).
8. Niente emoji, niente gradienti aggressivi, niente icone inventate: le icone sono stroke 1.5, 24×24, come negli artboard.

---

## COSA DEVI COSTRUIRE

### Stack

**HTML statico, CSS e JavaScript vanilla. Nessun framework, nessun bundler, nessuna dipendenza npm in runtime.** Il sito deve funzionare aperto da filesystem e caricato su qualsiasi hosting statico. Un generatore Node in `build/` per espandere i JSON nelle pagine va bene ed è incoraggiato — ma l'output deve essere HTML puro committato nel repo.

Progressive enhancement: filtri, accordion, menu mobile e lingua devono degradare in modo utile senza JS.

### Struttura URL

```
/                          → redirect a /es/
/es/                       /it/
/es/la-asociacion/         /it/l-associazione/
/es/la-asociacion/equipo/  /it/l-associazione/direttivo/
/es/eventos/               /it/eventi/
/es/eventos/<slug>/        /it/eventi/<slug>/
/es/ventajas-socios/       /it/convenzioni/
/es/ventajas-socios/hazte-partner/   /it/convenzioni/diventa-partner/
/es/guia-practica/         /it/guida-pratica/
/es/guia-practica/<slug>/  /it/guida-pratica/<slug>/
/es/noticias/              /it/notizie/
/es/colabora/              /it/collabora/
/es/hazte-socio/           /it/associati/
/es/contacto/              /it/contatti/
+ privacy, cookie, note legali, accessibilità in entrambe le lingue
```

Le rotte esatte sono in `nav.json` e `forms.json` — **quelle vincono** sul mio elenco.

### SEO — richiesta esplicita del cliente, trattala come deliverable di primo livello

- `<title>` e `<meta name="description">` unici per pagina, scritti bene, in lingua.
- **`hreflang` reciproco completo**: ogni pagina ES punta alla gemella IT e viceversa, più `x-default` sullo spagnolo. Errore classico da evitare: hreflang non reciproci.
- `<link rel="canonical">` autoreferenziale su ogni pagina.
- **JSON-LD** — usa `schemas.json` come base: `Organization` (con `sameAs` verso Instagram e Facebook) su tutte le pagine, `Event` su ogni scheda evento (con `location`, `startDate`, `offers` gratuiti, `inLanguage`), `BreadcrumbList` sulle pagine interne, `FAQPage` sulla guida pratica, `Article` sugli articoli, `LocalBusiness` sulle schede convenzione dove i dati bastano.
- Open Graph e Twitter card per pagina, con `og:locale` e `og:locale:alternate`.
- `sitemap.xml` con entrambe le lingue e le annotazioni `xhtml:link` alternate, `robots.txt`, `humans.txt`.
- Heading gerarchici: un solo `<h1>` per pagina, nessun salto di livello.
- `alt` descrittivo su ogni immagine di contenuto, `alt=""` sulle decorative (il watermark della Giralda è decorativo).
- Immagini: `width` e `height` espliciti per evitare layout shift, `loading="lazy"` sotto la piega, `decoding="async"`. Genera varianti WebP degli asset e servile con `<picture>`.
- Prestazioni: font con `font-display: swap` e `preconnect`, CSS critico inline nel `<head>` se serve, zero JS bloccante. Obiettivo Lighthouse ≥ 95 su tutte e quattro le voci, CLS < 0.05.

### Accessibilità

WCAG 2.1 AA. Skip link, landmark semantici, `lang` corretto sull'`<html>` e sugli inserti nell'altra lingua, dropdown e accordion con `aria-expanded` e navigabili da tastiera, focus trap nel menu mobile, `prefers-reduced-motion` rispettato.

### JavaScript necessario

Moduli piccoli e indipendenti in `assets/js/`:

- `header.js` — compressione 72→60px allo scroll, dropdown con hover e tastiera, menu mobile con focus trap
- `lang.js` — switch di lingua che porta alla pagina gemella, non alla home; ricorda la scelta in `localStorage`
- `filters.js` — filtri di eventi e convenzioni, senza reload, con lo stato riflesso in querystring così i link sono condivisibili
- `accordion.js` — FAQ e sezioni collassabili
- `form.js` — validazione del form partner in linea con gli stati disegnati (vuoto, focus, errore con icona, compilato, inviato), contatore caratteri, drop del logo con preview e limite 5MB
- `cookies.js` — banner con rifiuto di default e i due bottoni dello stesso peso visivo, come disegnato. Nessun tracker prima del consenso.

---

## ORGANIZZAZIONE IN AGENTI PARALLELI

Prima di tutto **fai la Fase 0 da solo**, in sequenza. Poi lancia gli agenti in parallelo. I confini di file sono espliciti: nessun agente scrive dove scrive un altro.

### Fase 0 — Fondamenta (tu, prima di tutto, ~1 passaggio)

1. Leggi `AIS Style Tile.dc.html`, `AIS Componentes.dc.html`, `AIS Navegacion.dc.html` e tutti i JSON in `brief/data/`.
2. Scrivi `assets/css/tokens.css` (custom properties), `assets/css/base.css` (reset, tipografia, `a`/`a:hover`, `focus-visible`) e `assets/css/components.css` (bottoni, campi, card, chip, adesivi, breadcrumb, paginazione, avvisi — tutti gli stati).
3. Scrivi `_partials/header.html`, `_partials/footer.html`, `_partials/head.html` (il blocco meta+SEO parametrico) e `_partials/cookie-banner.html`, estratti **carattere per carattere** da `AIS Navegacion.dc.html`.
4. Scrivi `build/build.mjs`: legge i JSON, applica i template, sputa HTML nelle rotte. Semplice, leggibile, senza dipendenze esterne.
5. Committa. **Da qui in avanti nessun agente tocca `assets/css/` né `_partials/`**: se serve un token nuovo, l'agente lo chiede a te.

### Agenti in parallelo (5 stream)

**Agente A — Home e pagine istituzionali**
`/es/`, `/it/`, `la-asociacion`, `equipo`, `historia`, `estatutos`, `prensa`, `contacto`
Fonte: `AIS Home.dc.html`, `AIS Equipo y Colabora.dc.html` (parte equipo)
Scrive: `es/index.html`, `it/index.html`, `es/la-asociacion/**`, `it/l-associazione/**`, `es/contacto/**`, `it/contatti/**`

**Agente B — Eventi**
Indice con filtri, schede evento, archivio, paginazione, serie (Feria, AIS Bambini, incontri letterari, escursioni, cineforum, corsi di cucina)
Fonte: `AIS Eventos.dc.html`, `AIS Evento Detalle.dc.html`, `events.json`
Scrive: `es/eventos/**`, `it/eventi/**`, `assets/js/filters.js`
Nota: il programma della IX Feria ha 13 appuntamenti su due giorni con tab sabato/domenica — riproducilo esattamente, incluse le attribuzioni agli artisti.

**Agente C — Convenzioni e form partner (priorità del cliente)**
Fonte: `AIS Convenios.dc.html`, `AIS Hazte Partner.dc.html`, `convenios.json`, `forms.json`
Scrive: `es/ventajas-socios/**`, `it/convenzioni/**`, `assets/js/form.js`
Nota: il form è progressivo — cinque campi obbligatori visibili, il resto dietro una riga espandibile "Añadir logo, mapa y redes (opcional)". Tutti e tre gli stati disegnati devono essere raggiungibili.

**Agente D — Guida pratica, notizie, volontariato**
Fonte: `AIS Guia Practica.dc.html`, `AIS Equipo y Colabora.dc.html` (parte colabora), `news.json`, `careers.json`
Scrive: `es/guia-practica/**`, `it/guida-pratica/**`, `es/noticias/**`, `it/notizie/**`, `es/colabora/**`, `it/collabora/**`, `assets/js/accordion.js`
Nota: la guida pratica ha quattro articoli (AIRE e consolato, Com.It.Es. e voto, arrivare a Siviglia, dove comprare italiano). L'artboard mostra il primo in dettaglio: gli altri tre seguono la stessa impaginazione. Serve anche lo stato "nessuna vacanza aperta".

**Agente E — SEO, sitemap, prestazioni, legale**
Scrive: `robots.txt`, `sitemap.xml`, `humans.txt`, `assets/js/lang.js`, `assets/js/header.js`, `assets/js/cookies.js`, le pagine legali, e un `SEO-REPORT.md`
Compito: dopo che A–D hanno finito, passa su tutte le pagine e verifica hreflang reciproci, canonical, JSON-LD valido, un solo h1, alt presenti, dimensioni immagini, e misura Lighthouse. Questo agente parte insieme agli altri sui file suoi e chiude per ultimo con la passata di verifica.

### Regole di coordinamento

- Ogni agente **legge** liberamente CSS e partials, ma **non li modifica**.
- Ogni agente riusa le classi già definite in `components.css`. Se serve un componente nuovo, prima cerca negli artboard se esiste già in altra forma; se davvero non c'è, chiedi a me prima di inventarlo.
- Nessun agente riscrive il microcopy: i testi degli artboard e dei JSON sono approvati, si copiano verbatim. Per i contenuti che gli artboard non coprono (i tre articoli extra della guida, le pagine legali) scrivi in tono asciutto e concreto come il resto del sito, e segnala nel report che sono testi nuovi da far validare.
- Alla fine ogni agente scrive due righe in `IMPLEMENTATION-LOG.md`: cosa ha fatto, cosa ha dovuto inventare, cosa resta aperto.

---

## PRIMA DI COMINCIARE

Fammi le domande che ti servono. Mi aspetto che almeno queste ti siano poco chiare, quindi chiedile se non le risolvi leggendo i JSON:

1. Dove va deployato il sito, e c'è un dominio o un percorso base diverso da root?
2. Il form partner e quello di iscrizione soci: a che endpoint mandano i dati? Un servizio esterno tipo Formspree, una mail, o un backend che devo prevedere?
3. La quota associativa e il link di pagamento: quali sono i valori reali? Negli artboard non ci sono cifre.
4. Le iscrizioni agli eventi passano da Eventbrite, come suggerisce il bottone nella scheda evento? Serve un link per evento?
5. Il vecchio blogspot 2009–2024 va linkato come archivio esterno o va migrato?
6. Serve una newsletter reale, e con quale provider?

Poi mostrami il piano prima di scrivere codice.

## CRITERI DI ACCETTAZIONE

Considero il lavoro finito quando:

- [ ] Tutte le rotte di `nav.json` esistono in entrambe le lingue e non ci sono link morti
- [ ] Affiancando una pagina costruita al suo artboard, colori, tipografia, spaziature e stati coincidono
- [ ] Nessun blocco con testo di corpo ha opacità ridotta
- [ ] Ogni barretta tricolore ha il suo filetto
- [ ] hreflang reciproci al 100%, canonical su ogni pagina, JSON-LD che passa il validatore Google
- [ ] Lighthouse ≥ 95 in tutte e quattro le voci su home, indice eventi e form partner
- [ ] Tutto navigabile da tastiera, focus sempre visibile, zero errori axe
- [ ] Il sito funziona con JS disattivato: si legge tutto, i form si possono inviare
- [ ] `IMPLEMENTATION-LOG.md` e `SEO-REPORT.md` scritti
