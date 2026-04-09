# Feed the City — Claude Instructions (v2)

## Non-Negotiable Rules
1. **Commit + push after every code change.** No exceptions.
   ```bash
   git add .
   git commit -m "Auto-commit: <description>"
   git push origin master
   ```
2. **Screenshot loop before finalizing any UI change** — see section below.
3. **No frameworks, no build step.** Vanilla HTML/CSS/JS only.
4. **Deployment: Vercel.** Project already linked (`prj_WunEWPfo3OG5sF32TJAJWgAxLjZv`, org `team_zCqyxNju3meHNUpYjPn3P937`). Push to `master` = auto-deploy.

---

## Three Products — What They Are

```
/planner/     Product 1  iframe on all 46 city event pages (Wix)
/impact/      Product 2  standalone personal dashboard page (not an iframe)
/dashboard/   Product 3  public city totals + admin data entry (Supabase, future)
/shared/      Config used by all three products
/docs/        Strategy docs and reference screenshots
```

### Product 1 — The Planner (`/planner/`)
- **Purpose:** Replaces "What to Bring" on every Tango Charities city event page.
- **Embed:** `<iframe src="https://[vercel-url]/planner/?chapter=denton-tx" ...>`
- **City locking:** `?chapter=` URL param auto-selects and hides the city picker. No picker shown when chapter is set.
- **Single-page design:** No multi-view JavaScript flip. One scrollable page:
  - Goal setter (sandwich count, +/− by 5)
  - Ingredient rows with images, quantities, and official descriptions
  - Copy list / Save image buttons
  - "LOG YOUR IMPACT & REGISTER ↓" — logs email to localStorage, fires postMessage to scroll parent to Eventbrite
- **Canvas outputs:** Grocery checklist image (900px wide), Impact card (1080×1350px Instagram 4:5)
- **localStorage keys:** `ftc_email`, `ftc_logs` (array of `{ meals, date, chapter }`)

### Product 2 — My Impact (`/impact/`)
- **Purpose:** Volunteer's personal history page. Bookmarkable. Not an iframe.
- **Auth:** Email lookup only (Phase 1: localStorage; Phase 2: Supabase)
- **Not yet built.** Placeholder exists.

### Product 3 — City Dashboard + Admin (`/dashboard/`, `/dashboard/admin.html`)
- **Purpose:** Public view of city/national meal totals + city leader data entry.
- **Admin flow:** City leader logs in → selects city → inputs monthly meal count → saves.
- **Requires Supabase. Do not build yet.**
- **Data rule:** City leader totals are SEPARATE from volunteer self-reports. Do not mix.

---

## Adding a New City — One Step

Edit `shared/chapters.js` only. Add one object to the `CHAPTERS` array:

```js
{ slug: 'city-name-st', name: 'City, ST', page: '/feed-the-city-slug', week: 3 }
```

- `slug`: lowercase, hyphenated, used as `?chapter=` URL param
- `name`: display label in UI
- `page`: Wix event page path (relative to tangocharities.org)
- `week`: 1, 2, 3, or 4 (which Saturday of the month)

**That's all.** All three products import `chapters.js`. Nothing else to touch.

---

## Iframe Embed (copy-paste per Wix city page)

```html
<iframe
  src="https://[vercel-url]/planner/?chapter=denton-tx"
  width="100%"
  height="950"
  frameborder="0"
  scrolling="no"
  allow="clipboard-write; web-share"
  title="Feed the City — Denton Volunteer Planner">
</iframe>
```

Change `?chapter=denton-tx` to match the city slug. See `shared/chapters.js` for all slugs.

### Wix Velo snippet (add once per city page — identical on all 46)

```js
$w.onReady(function() {
  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'ftc:scrollToRegistration') {
      $w('#eventbriteSection').scrollTo(); // use actual Wix element ID
    }
    if (e.data && e.data.type === 'ftc:resize') {
      $w('#plannerIframe').style.height = e.data.height + 'px';
    }
  });
});
```

### postMessage events fired by the planner

```js
// Scroll parent page to Eventbrite embed
window.parent.postMessage({ type: 'ftc:scrollToRegistration' }, '*');

// Dynamic iframe height (called after every view change)
window.parent.postMessage({ type: 'ftc:resize', height: document.body.scrollHeight }, '*');
```

---

## Brand

| Token | Value | Use |
|---|---|---|
| `--orange` | `#FF6500` | Primary CTA, hero numbers, accents |
| `--navy` | `#003366` | Canvas image headers/footers only (NOT UI backgrounds) |
| `--sky` | `#3BAEE8` | Impact cards, secondary accents |
| `--white` | `#FFFFFF` | UI surfaces, card backgrounds |
| `--muted` | `#9CA3AF` | Hints, secondary labels |

**Fonts:** Anton (display/big numbers) · Oswald (uppercase labels) · Open Sans (body/descriptions)

### ⚠️ STRICT UI RULES — These Cannot Be Overridden

1. **NEVER use dark mode, dark backgrounds, "noir", or "tactical" themes.** The planner is an iframe embedded inside a bright Wix event page. Any dark background will create a jarring black box on the page and is unacceptable.

2. **ALWAYS use a bright/white background.** Body background must be white or very light gray (e.g., `#F5F5F7`, `#FAFAFA`, `#FFFFFF`). This ensures seamless visual integration with the parent Wix page.

3. **Use glassmorphism for UI cards.** Ingredient rows and interactive elements should use frosted glass: `background: rgba(255,255,255,0.90)`, subtle `box-shadow`, and `border: 1px solid rgba(0,0,0,0.07)`. This is the established aesthetic.

4. **Orange (`#FF6500`) is used for accents only.** Hero numbers, CTAs, and quantity values. Not for large background areas or full-bleed sections in the iframe UI.

5. **Navy (`#003366`) is for canvas/image outputs only** (the Save Image card header/footer). Never use navy as a page background or section background in the iframe UI.

---

## What to Bring — Official Descriptions

Source: `tangocharities.org/feed-the-city-denton`. Use these exact descriptions in ingredient rows.

| Item | UI Description |
|---|---|
| **Sliced Bread** | Wheat or whole grain preferred |
| **Deli Meat** | Pre-packaged only — turkey, chicken, or ham. Organic preferred. **No deli counter meat.** |
| **Sliced Cheese** | Real sliced cheese. **Not processed cheese or cheese product.** |
| **Yellow Mustard** | **No spicy mustard or mayo.** |
| **Chips** | Full-size bags only. Healthier oils preferred (avocado, olive). **No snack-size bags.** |
| **Tangerines** | Halos or Cuties · 3 lb bags |
| **Sandwich Bags** | **Must zip.** Not fold-over bags. |

**Default goal:** 25–30 sandwiches per person (per official site guidance).

**Quantity formulas (goal = sandwich count):**

| Item | Formula |
|---|---|
| Sliced Bread | `ceil(goal / 10)` loaves |
| Deli Meat | `goal × 2` oz |
| Sliced Cheese | `goal` slices |
| Yellow Mustard | `ceil(goal / 50)` bottles |
| Sandwich Bags | `ceil(goal / 50)` boxes |
| Chips | `max(1, floor(goal / 20))` bags |
| Tangerines | `max(1, floor(goal / 20))` bags (3 lb) |

---

## Screenshot Loop — MANDATORY for all UI changes

Never finalize a UI change without at least one visual check.

```bash
# 1. Start server in background
npx serve . --listen 3000

# 2. Take screenshot (run from repo root)
node -e "
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:3000/planner/');
  await page.waitForTimeout(800);
  await page.screenshot({ path: '_shot.png', fullPage: true });
  await browser.close();
})();
"

# 3. Read the file
# Read('_shot.png') — analyze before finalizing
```

**Quality bar:** Strava / Duolingo / Notion level. Airy, premium, modern. Numbers dominate. Brand colors present. **White background. Glassmorphism cards. Never dark.**

**Viewport:** 390×844 (iPhone 14 standard). Also test 360×700 for iframe simulation.

---

## File Structure Reference

```
/planner/
  index.html      ← Product 1 (THE active product)
  style.css
  script.js

/impact/
  index.html      ← Product 2 placeholder

/dashboard/
  index.html      ← Product 3 public placeholder
  admin.html      ← Product 3 admin placeholder

/shared/
  chapters.js     ← ALL 46 cities live here. Add new cities here only.
  brand.css       ← CSS custom properties (import in each product's CSS)

/docs/
  document_of_understanding.md
  strategic_report.md
  ftc_executive_blueprint.md
  ref/
    tc_denton.png       ← Live screenshot: Denton event page
    tc_ftc_main.png     ← Live screenshot: main FTC page
    tc_denton_text.txt  ← Extracted text: Denton page
    tc_main_text.txt    ← Extracted text: main FTC page

CLAUDE.md         ← This file
vercel.json       ← Routing: / → /planner/; iframe headers for /planner/
.gitignore        ← Excludes temp screenshots (_shot*.png etc.)
```

---

## Context: The Tango Charities Site

- **Main FTC page:** `tangocharities.org/feed-the-city` — lists all cities by Saturday week, has Google map. This is where "Find other events" links should point.
- **City event pages:** `tangocharities.org/feed-the-city-[city]` — where each iframe embeds.
- **Page layout (top → bottom):** Hero → What to Bring **(our iframe here)** → Drop-off info → How it works → Upcoming Dates → Eventbrite embed → FAQ → Footer
- **Wix platform:** Thunderbolt renderer. Content is JS-rendered — use Playwright to screenshot, not WebFetch.
- **8 million+ meals** served nationally since 2015. 73 cities, 18 states, 5 countries. 110,000 volunteers.
