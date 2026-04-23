# Feed The City — Volunteer Planner

A single-page React app that replaces the static "What to Bring" block on every [Tango Charities](https://tangocharities.org) city event page. Volunteers pick a sandwich goal, the tool computes exact ingredient quantities, and one button scrolls the parent Wix page down to the existing Eventbrite embed so they can register.

Designed to live inside a Wix iframe on ~46 city pages. Height and scroll-to-registration are coordinated with the parent page via `postMessage`.

## Flow

1. **Plan** — pick a sandwich goal; see live-computed quantities for bread, meat, cheese, mustard, bags, chips, tangerines.
2. **Receipt** — tabbed shopping-list card with the same quantities; Copy / Save-as-Image / Register Now.
3. **Register Now** — posts `{ type: 'ftc:scrollToRegistration' }` to the parent window, which scrolls the Wix page down to the native Eventbrite embed already on that page.

## Tech stack

- **React 19** + **Vite 8**
- **Framer Motion** for view transitions and staggered list reveals
- Vanilla CSS (glassmorphism on white; no Tailwind / no component library)
- Deployed on **Vercel**, auto-deployed on push to `master`

## Local development

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # writes to dist/
npm run preview    # serve the built bundle
```

## Iframe integration (Wix)

The planner lives at the site root. Per-city chapter info is passed via a URL param:

```html
<iframe
  src="https://<vercel-url>/?chapter=denton-tx"
  width="100%"
  height="950"
  frameborder="0"
  scrolling="no"
  allow="clipboard-write; web-share"
  title="Feed the City — Volunteer Planner">
</iframe>
```

### Required Wix Velo snippet (one per event page)

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
| `ftc:resize` | Whenever body height changes (rAF-throttled) | `{ type, height }` |
| `ftc:scrollToRegistration` | User clicks **Register Now** on the receipt screen | `{ type }` |

## Adding a new city

Edit `src/data/chapters.js` only. Add one object to the `CHAPTERS` array:

```js
{ slug: 'city-name-st', name: 'City, ST', page: '/feed-the-city-slug', week: 3 }
```

- `slug` — lowercase, hyphenated, used as `?chapter=` URL param
- `name` — display label shown on the receipt
- `page` — Wix event page path (for reference only)
- `week` — 1–4, which Saturday of the month

## Project layout

```
src/
  App.jsx                    two-state flow root (PLAN ↔ EVENTBRITE)
  main.jsx                   React entrypoint
  index.css                  brand tokens + global resets
  components/
    MainCalculator.jsx       goal setter + live ingredient grid
    IngredientCard.jsx       row with product image, description, qty
    EventbriteReveal.jsx     tabbed receipt + Copy / Save / Register
  data/
    chapters.js              46 city entries
    ingredients.js           ITEMS, quantity formulas, unit helpers
public/
  favicon.svg
  icons.svg
vercel.json                  SPA rewrites + iframe-allow headers
```

## Brand

| Token | Value | Use |
|---|---|---|
| `--orange` | `#FF6500` | Primary CTA, hero numbers, accents |
| `--navy` | `#003366` | Receipt headline, canvas header |
| `--white` | `#FFFFFF` | Card surfaces |
| `--muted` | `#9CA3AF` | Hints, secondary labels |

Fonts: **Anton** (display) · **Open Sans** (body) — both via Google Fonts.

All UI runs on a white / near-white background so the iframe blends into the Wix page. No dark mode.
