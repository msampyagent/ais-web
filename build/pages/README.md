# Page modules — the contract

Every page of the site is produced by a module in this directory matching
`**/*.page.mjs`. `build/build.mjs` discovers them, runs them, and then writes
the root redirect, `sitemap.xml` and `robots.txt`.

## Why pages are modules and not hand-written HTML

The acceptance criteria require reciprocal `hreflang` on every page, a
self-referential canonical, one `<h1>`, and a language switcher that lands on
the twin page rather than the home page. Hand-copying a `<head>` and a header
into ~76 files makes those properties something a human has to remember. Here
they are produced once, from the route registry, so they cannot drift.

You write the `<main>`. The shell is not yours to duplicate.

## Shape

```js
import { data, routes, routeOf, registerRoute, renderPage, writePage, esc, LOCALES }
  from '../build.mjs';

export default {
  id: 'convenios',
  async build() {
    for (const locale of LOCALES) {
      const alternates = routes.get('convenios');      // both locales, always
      writePage(alternates[locale], renderPage({
        locale,
        alternates,
        activeNav: 'convenios',                        // marks the top-bar item
        title: '…',                                    // unique, in `locale`
        description: '…',                              // unique, in `locale`
        breadcrumb: [                                  // optional → BreadcrumbList
          { label: '…', href: routeOf('home', locale) },
          { label: '…', href: alternates[locale] },
        ],
        jsonld: [ /* Event, FAQPage, Article… */ ],     // optional
        scripts: ['/assets/js/filters.js'],            // optional, page-specific
        body: `…`,                                     // your <main> contents
      }));
    }
  },
};
```

## Rules

1. **Always loop `LOCALES` and always pass the full `alternates` object.**
   Writing one locale, or hand-building an alternates map, breaks hreflang
   reciprocity — the one SEO defect the client asked us not to ship.

2. **Routes come from the registry.** Use `routeOf(id, locale)` for links.
   For pages that are not in `nav.json` (an event detail, a guide article),
   call `registerRoute(id, { es: 'eventos/mi-evento', it: 'eventi/mio-evento' })`
   first — it returns the alternates object you then pass to `renderPage`.

3. **`esc()` every value that comes from JSON.** Apostrophes in
   `L'Associazione` and quotes in event titles will otherwise break attributes.

4. **Reuse the classes in `assets/css/components.css`.** If a component seems
   missing, search the artboards for it in another form before inventing one.
   Do not edit `assets/css/**` or `_partials/**` — ask instead.

5. **Copy microcopy verbatim** from the artboards and the JSON. Where the
   artboards cover nothing (the three extra guide articles, the legal pages),
   write new copy in the same dry register and list it in
   `IMPLEMENTATION-LOG.md` as unvalidated.

6. **`TODO_` stays `TODO_`.** Never substitute a plausible-looking board
   member, membership fee, CIF or registry number.

7. **One `<h1>` per page**, no skipped heading levels, `alt` on every content
   image and `alt=""` on decorative ones, explicit `width`/`height`.

## Running it

```bash
node build/build.mjs
```

Output lands in `/es/**` and `/it/**` as committed HTML. The build is
deliberately dependency-free: Node standard library only.
