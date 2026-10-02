# Kumo Studio

A bilingual (EN/JA) studio site built as a portfolio piece.

**Live demo — <https://prototype.ddoverse.com>**
**Build plan — <https://prototype.ddoverse.com/plan>**

> Kumo Studio is a fictional studio. The clients, case studies and contact
> details are invented for this piece. The engineering is real; the client
> list is not. The deployment serves `X-Robots-Tag: noindex` for that reason.

---

## What this answers

The brief asked three questions. Each is answered by something you can open
and check rather than by a claim.

### 1. Internationalisation

English at the root, Japanese under `/ja`, resolved in middleware.

| Concern | Where |
|---|---|
| Routing | `src/middleware.ts` — rewrites `/work` → `/en/work`, 308s `/en/*` to the canonical form |
| Locale helpers | `src/i18n/config.ts` — one source for paths, canonicals and hreflang |
| UI strings | `src/i18n/dictionary.ts` |
| Content | `src/content/seed.ts` — paired `{ en, ja }` fields, the shape Sanity will deliver |

Two details worth opening the source for:

- **The language switch stays on the same document.** A case study switches to
  its counterpart, never to the home page. The current path reaches the server
  component through an `x-pathname` header set in middleware, so the switch
  costs no client JavaScript — `usePathname` would have made it a client
  component.
- **Canonical is per locale.** `/ja/work/abc` declares itself canonical, not
  the English page. Pointing every canonical at the default locale is the
  common mistake here: it tells search engines the Japanese pages are
  duplicates and contradicts the hreflang block directly beneath it.

`hreflang` (`en`, `ja`, `x-default` → en), `<html lang>` and the sitemap's
per-URL alternates all derive from the same helper, so they cannot drift apart.

### 2. Performance

Server Components by default. Client JavaScript exists in exactly two files:

- `src/components/VideoFacade.tsx` — click-to-load Vimeo
- `src/components/EnquiryForm.tsx` — progressive enhancement over a form that
  already works without it

| Route | First Load JS |
|---|---|
| `/[lang]` | 106 kB |
| `/[lang]/work` | 106 kB |
| `/[lang]/work/[slug]` | 107 kB |
| `/[lang]/contact` | 107 kB |

Budget: 150 kB. No web fonts are downloaded — the stack is system fonts
chosen to hold up at Japanese text density, which is where a full Noto Sans JP
weight would otherwise cost megabytes.

### 3. Enquiry form to CRM

`src/app/[lang]/contact/actions.ts` is a Server Action, so **the form works
with JavaScript disabled** — the browser posts it and the result comes back as
a redirect. Validation is `zod` (`src/lib/enquiry.ts`).

Delivery (`src/lib/delivery.ts`):

```
form → Server Action → zod → HubSpot Forms v3
                              ↓ fail
                      Redis queue + Resend email → cron retry (backoff)
```

- An idempotency key derived from `email + message` stops retries creating
  duplicate contacts — the usual way this design goes wrong.
- The email fallback fires immediately, so a human has the enquiry before the
  queue drains.

**You can watch this fail.** `/contact` carries a *Simulate CRM outage* toggle.
Turn it on, submit, and the response tells you the enquiry was queued; the
server log records `"reason":"simulated-outage"`. The toggle is a cookie set
by a Server Action, so it works without JavaScript too, and it is per visitor.

---

## Running it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

No environment variables are required. Without credentials the site reads the
local seed content and the enquiry form reports the queued path honestly
rather than faking a success.

| Variable | Effect when set |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Content comes from Sanity instead of the seed |
| `HUBSPOT_PORTAL_ID`, `HUBSPOT_FORM_ID` | Enquiries post to HubSpot |
| `REDIS_URL` | Failed deliveries persist to a queue instead of the log |
| `RESEND_API_KEY`, `ENQUIRY_EMAIL` | Email fallback actually sends |
| `SIMULATE_CRM_OUTAGE=1` | Forces the outage for everyone, for recording a demo |

---

## Structure

```
src/
  middleware.ts          locale routing + x-pathname for the language switch
  i18n/                  locale config, URL helpers, UI strings
  content/seed.ts        case studies and services, paired en/ja
  lib/
    content.ts           content access — swap this one file for Sanity
    enquiry.ts           zod schema, HubSpot payload, idempotency key
    delivery.ts          HubSpot → queue → email fallback
  app/[lang]/            six pages, both locales
  components/            header, footer, JSON-LD, video facade, form
```

Structured data: `Organization`, `WebSite`, `Service`, `BreadcrumbList`,
`VideoObject`. `Person` is deliberately omitted.

---

## Design

Reference points were Japanese studio sites — [mount.jp](https://mount.jp) and
[baqemono.jp](https://baqemono.jp). What they have in common shaped this one:

- No cards, pills, rounded corners, shadows or gradients. Structure comes from
  1px rules and whitespace.
- No accent colour. Hierarchy is size, weight and space.
- One palette. No dark mode — keeping two sets means a value like rule
  contrast eventually breaks in one of them.
- Plain-noun navigation, and a language switch labelled `日本語` rather than a
  two-letter toggle.

There are no decorative images anywhere, including the video facade, which is
typographic.

---

## Not built yet

Stated plainly because the demo is live and checkable:

| Item | Status |
|---|---|
| Lighthouse CI, Playwright, axe in GitHub Actions | Specified, not yet wired. The numbers above were measured by hand. |
| Sanity Studio at `/studio` | Schema and content layer are in place; needs a Sanity project |
| GSAP, Plausible | Not in the demo — neither earns its weight without real content |
| Hosting | The demo runs on our own server (nginx + Node, `output: "standalone"`). The build targets Vercel; removing that one line is the whole move. |

The first test to add is an assertion that every page's canonical matches its
own URL. That bug was in this repository and was caught by reading the HTML,
not by a test — which is the argument for the test.
