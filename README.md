# Feed the City — Volunteer Planner

A single-page React app that turns a volunteer's sandwich goal into an exact shopping list, then hands them off to event registration — built to replace the static "What to Bring" block on [Tango Charities](https://tangocharities.org) *Feed the City* event pages.

## Status

**Live.** The calculator, shopping-list output, and registration handoff are built and deployed. The app is designed to be embedded as an iframe on the Tango Charities Wix event pages.

This README marks **what is built** vs **what is planned** so the scope is never overstated:

| Capability | State |
|---|---|
| Sandwich-goal ingredient calculator | ✅ Built |
| Shopping-list output (copy text / save as image) | ✅ Built |
| Registration handoff (scroll parent page to Eventbrite) | ✅ Built |
| Per-city chapter context via URL parameter | ✅ Built |
| Iframe auto-resize for Wix embeds | ✅ Built |
| Impact tracker / lifetime-meals dashboard | 🚧 Planned |
| Volunteer email capture & profile | 🚧 Planned |
| Shareable "Impact Card" image | 🚧 Planned |
| Supabase backend / cross-device sync | 🚧 Planned |
| Organizer/leader features (leaderboards, community progress) | 🚧 Planned |

The planned items are described in the project's `docs/` as a product vision. **None of them exist in the shipped code yet** — there is no email capture, impact tracking, or backend in this repository.

## Demo

**Live deployment:** https://what-to-bring-ftc.vercel.app

The planner normally runs inside an iframe on a Tango Charities event page; the link above is the standalone build. Append `?chapter=<slug>` to preview a specific city — for example, [`?chapter=denton-tx`](https://what-to-bring-ftc.vercel.app/?chapter=denton-tx). Chapter slugs are listed in `src/data/chapters.js`.

## Overview

Instead of reading a static "What to Bring" list and doing the math by hand, a volunteer picks how many sandwiches they want to supply and the app computes exact quantities for every ingredient. It then produces a shareable shopping list and sends the volunteer on to the event's existing Eventbrite registration.

The app runs as an iframe embedded in the parent Wix page. It coordinates its height and a scroll-to-registration action with the parent via `postMessage`, so the embed feels like a native part of the page.

## Features

1. **Plan** — pick a sandwich goal (5–500) with a stepper or direct input; quantities for bread, deli meat, cheese, mustard, sandwich bags, chips, and tangerines update live.
2. **Shopping list** — a receipt-style card showing the same quantities, with **Copy** (clipboard) and **Save as Image** (PNG, rendered with the Canvas API; uses the native Web Share sheet on mobile when available).
3. **Register Now** — posts `{ type: 'ftc:scrollToRegistration' }` to the parent window, which scrolls the Wix page down to the Eventbrite embed already on that page.

Per-city context (city name and which Saturday of the month) is read from the `?chapter=` URL parameter and shown on the shopping list.

## Tech stack

- **React 19** + **Vite 8**
- **Framer Motion 12** — view transitions and staggered list reveals
- Vanilla CSS (glassmorphism on a white background; no Tailwind, no component library)
- **Vercel** for hosting, auto-deployed on push to `master`

## Getting started

Requires Node.js 20.19+ or 22.12+ (Vite 8).

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # outputs to dist/
npm run preview    # serve the built bundle locally
npm run lint       # ESLint
```

## Iframe integration (Wix)

The planner lives at the site root. Per-city chapter info is passed via a URL parameter:

```html
<iframe
  src="https://what-to-bring-ftc.vercel.app/?chapter=denton-tx"
  width="100%"
  height="950"
  frameborder="0"
  scrolling="no"
  allow="clipboard-write; web-share"
  title="Feed the City — Volunteer Planner">
</iframe>
```

`height` is a fallback; the app posts its real height to the parent on every layout change (see below), so the parent can resize the iframe to fit.

### Wix Velo snippet (one per event page)

```js
$w.onReady(function () {
  window.addEventListener('message', function (e) {
    if (!e.data) return
    if (e.data.type === 'ftc:resize') {
      $w('#plannerIframe').style.height = e.data.height + 'px'
    }
    if (e.data.type === 'ftc:scrollToRegistration') {
      $w('#eventbriteSection').scrollTo()
    }
  })
})
```

Replace `#plannerIframe` and `#eventbriteSection` with the real Wix element IDs.

### Messages emitted by the planner

| Event | When | Payload |
|---|---|---|
| `ftc:resize` | Whenever the body height changes (rAF-throttled) | `{ type, height }` |
| `ftc:scrollToRegistration` | User clicks **Register Now** on the shopping-list screen | `{ type }` |

## Adding a new city

Edit `src/data/chapters.js` only. Add one object to the `CHAPTERS` array:

```js
{ slug: 'city-name-st', name: 'City, ST', page: '/feed-the-city-slug', week: 3 }
```

- `slug` — lowercase, hyphenated; used as the `?chapter=` URL value
- `name` — display label shown on the shopping list
- `page` — Wix event-page path (for reference only)
- `week` — 1–4, which Saturday of the month the event falls on

## Project layout

```
src/
  App.jsx                  two-state flow root (PLAN ↔ EVENTBRITE)
  main.jsx                 React entry point
  index.css                brand tokens + global resets
  components/
    MainCalculator.jsx     goal stepper + live ingredient grid
    IngredientCard.jsx     row with product image, hint, and quantity
    EventbriteReveal.jsx   shopping-list card + Copy / Save / Register
  data/
    chapters.js            city entries + lookup helpers
    ingredients.js         items, quantity formulas, unit helpers
public/
  favicon.svg
  icons.svg
docs/                      product/planning notes and design references
index.html                 app shell
vite.config.js             Vite + React plugin
eslint.config.js           ESLint flat config
vercel.json                SPA rewrites + iframe-allow headers
```

> The `docs/` folder contains internal product, strategy, and UX-planning notes. Several describe **planned** features (impact tracker, email capture, Supabase) that are not yet built — treat them as vision documents, not a description of the shipped app.

## Brand

| Token | Value | Use |
|---|---|---|
| `--orange` | `#FF6500` | Primary CTA, hero numbers, accents |
| `--navy` | `#003366` | Receipt headline, canvas header |
| `--white` | `#FFFFFF` | Card surfaces |
| `--muted` | `#9CA3AF` | Hints, secondary labels |

Fonts: **Anton** (display) and **Open Sans** (body), both loaded from Google Fonts. All UI runs on a white / near-white background so the iframe blends into the Wix page. No dark mode.

## License

No license has been chosen yet, so this project is currently **all rights reserved** by its author. If you intend to make it reusable, add a `LICENSE` file (for example, MIT).
