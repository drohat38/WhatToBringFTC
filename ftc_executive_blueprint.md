# Feed the City — Contribution Planner
## Project Blueprint

---

## Project Overview

The **Feed the City Contribution Planner** is a volunteer-facing web tool designed for any Feed the City chapter. It lives embedded as an `<iframe>` inside a Wix event page, replacing a static "What to Bring" image that previously gave volunteers no way to plan, calculate, or track their contributions.

The tool has one job: make it as easy as possible for a volunteer to show up with the right supplies, feel the weight of their personal impact, and want to come back next month.

**Founder:** Deven Rohatgi, Feed the City Denton  
**Organization:** Tango Charities  
**Status:** Active development — existing HTML prototype as starting point  
**Hosting:** Vercel (preview/development) → single HTML file embedded in Wix (production)  
**Backend:** Supabase (planned — not yet connected)

---

## Core Principles

1. **Zero friction above everything.** Every interaction must feel effortless. If something makes a volunteer think twice, it gets removed or simplified.
2. **Genuine impact, not performance.** This is not a gamification system. Milestones are written in human language, not points or badges.
3. **Brand fidelity.** The tool must feel native to the Feed the City / Tango Charities brand at all times.
4. **Iframe reality.** This tool lives inside a Wix iframe. Every design decision must account for real estate constraints on both mobile and desktop, iframe scroll behavior, and the inability to modify the parent page.

---

## Deployment Context

### Iframe on Wix
- The tool is embedded as an `<iframe>` in the "What to Bring" section of each chapter's Wix event page
- The iframe resizes its height dynamically via `postMessage` to the parent Wix page
- The tool cannot access or modify anything on the parent Wix page
- No outer nav, no header chrome — the tool starts immediately with its first element
- The Wix page already provides the "Feed the City [City]" section heading above the iframe

### Device split
- **Mobile** is the primary use case. Volunteers are on their phones, on the Wix page, scrolling down to plan before the event
- **Desktop** is secondary but must be equally polished
- The iframe scrolls as part of the parent page — the tool itself should never have internal scroll

### Hosting
- **Development/preview:** Deployed to Vercel (free tier, instant deploys from repo)
- **Production:** Single self-contained HTML file, hosted on Vercel, embedded via Wix iframe embed block

---

## Brand System (Locked)

| Element | Value |
|---|---|
| Primary font | Anton (Google Fonts) — all headings, numbers, labels |
| Body font | Open Sans (Google Fonts) — body copy, hints, descriptions |
| Primary color | `#FF6500` Ignite Orange |
| Structure color | `#003366` Electric Royal Blue (Navy) |
| Muted/secondary | `#9CA3AF` |
| Border | `#E5E7EB` |
| Background | `#F9FAFB` (surface), `#FFFFFF` (card) |
| Success | `#16A34A` |
| Warning amber | `#FEF3C7` bg / `#92400E` text |

**The brand is locked. Do not introduce new typefaces or primary colors.**  
Frontend enhancement is welcome and encouraged — glassmorphism, micro-animations, depth, React if it serves the experience — as long as it operates within this brand system.

---

## Architecture

### Current State
Single self-contained HTML file — HTML, CSS, and JavaScript in one document. No framework, no build process, no dependencies beyond two Google Fonts imports. Runs entirely in the browser.

### Planned
- **Vercel deployment** for instant preview URLs
- **Supabase** for persistent cross-device data (replacing localStorage)
- Framework upgrade is at developer's discretion — React is acceptable if it meaningfully improves the frontend experience without overcomplicating the deployment pipeline

### Data (Current — localStorage)
All volunteer data is currently saved in the browser only:
- `ftc_email` — the volunteer's email
- `ftc_logs` — array of log entries: `{ meals, date, chapter }`

**Known limitation:** localStorage is device-specific. If a volunteer logs on their phone then checks on their laptop, history is empty. This is the primary reason Supabase is planned.

---

## Three Views

The tool has exactly three views. They **flip** between each other — no tabs, no persistent navigation. Each view replaces the previous one with a smooth fade/slide transition.

```
[ PLAN ] → (lock in) → [ LOG ] → (submit) → [ IMPACT ]
              ↑                        ↑
         (back link)             (back link)
```

---

## View 1: Plan

The volunteer sets their sandwich goal and sees exactly what to buy.

### Goal Control
- Large orange number (Anton, ~80px) — the primary interactive element
- Two orange circular arrow buttons (chevrons, not + and −) — step by ±5
- Number is directly tappable/clickable to type a custom value
- Range: 5 minimum, 500 maximum
- Label beneath: "SANDWICHES" in small caps
- Nudge copy: "Most volunteers bring supplies for 25–30 sandwiches."
- Instructions copy above the control (3 lines): Plan → Log → Impact

### Ingredient Cards — Sandwich Supplies

Five cards displayed in a responsive grid:

| Breakpoint | Columns |
|---|---|
| Desktop (>820px) | 5 columns |
| Tablet (460–820px) | 3 columns |
| Mobile (<460px) | 2 columns, 5th card centered |

**Card anatomy (top to bottom):**
1. Product image (from Wix CDN — already in code)
2. Calculated quantity — navy, large Anton number
3. Unit label — muted, small caps (Loaves / oz total / Slices / Bottle / Box)
4. Thin separator line
5. Item name — navy, Anton small caps
6. Hint text — small, navy tint background pill (assumptions used in calc)

**No adjustment buttons on ingredient cards.** The quantity is purely output based on the goal — not something the volunteer interacts with.

### Calculation Logic — Sandwich Supplies

| Ingredient | Formula | Unit displayed |
|---|---|---|
| Sliced Bread | `ceil(goal / 10)` | Loaves |
| Deli Meat | `goal × 2` | oz total |
| Sliced Cheese | `goal` | Slices |
| Yellow Mustard | `ceil(goal / 50)` | Bottle(s) |
| Sandwich Bags | `ceil(goal / 50)` | Box(es) |

**Package assumptions (shown in hint text, not in calculation):**
- Bread: ~20 usable slices/loaf, 2 per sandwich
- Deli meat: 2 oz per sandwich, any package size accepted
- Cheese: 1 slice per sandwich
- Mustard: 1 squirt per sandwich, 1 standard bottle covers ~50 sandwiches
- Sandwich bags: ~50 per box, 1 per sandwich

### Ingredient Cards — Snack Items

Two cards, side by side (2-col grid, max-width ~480px, centered):
- **Large Chips** — stepper control (− / number / +)
- **Tangerines** — stepper control (− / number / +)

**Snack calculation:**
- Base quantity: `ceil(goal / 10)` bags of each
- Stepper allows volunteer to adjust up or down from that base
- Snacks **do not affect** the sandwich count or meal total in any way
- Snack quantities are informational only

### Summary + CTA

Below the cards, a clean centered text block (no colored card behind it):

```
These supplies make [30] sandwiches.
Bring these to the event and help assemble meals for families in your community.

[ Lock In My Plan → ]    ← primary orange button, max-width ~340px, centered

View my impact history   ← subtle underline link, muted gray
```

- The sandwich count in the headline animates (pop) when the number changes
- "Lock In My Plan" navigates to Log view
- "View my impact history" navigates to Impact view (or Log view if no email saved)

---

## View 2: Log

The volunteer sees their grocery list, saves/copies it, then commits by entering their email and city.

### Framing
This is a **pre-event psychological commitment mechanism**, not a post-event checklist. The volunteer is declaring what they plan to bring. There is no verification, no checkboxes, no post-event count. The act of logging is the commitment.

### Layout (top to bottom)

**1. Back link** — subtle "← Back" text link, top left

**2. Section heading**
```
Lock In Your Plan
Tracks your impact over time.
```

**3. Grocery List Receipt**
Contained card (light background, subtle border) showing:
- Header: "Your Grocery List" left / "[30] Sandwiches" right (orange)
- Dashed divider
- Each item as a row: item name (muted, dotted underline) / quantity (navy, bold)
- Dashed divider
- Footer: "Feed the City" centered, light gray

**4. Save/Copy controls**
```
[ Copy List ]    [ Save Image ↓ ]
```
- Copy list: copies a plain-text formatted grocery list to clipboard
- Save image: generates a branded PNG via Canvas API (see below), triggers native share sheet on mobile, downloads on desktop
- Small hint copy: "Save or copy this so you have it when you're at the store."

**5. Form**
- Email field — label: "Email Address" / placeholder: "email@example.com" / hint: "Use the same email as your Eventbrite registration."
- City dropdown — label: "Your Chapter City" / all 48 Feed the City chapters listed / **pre-selected to the chapter hosting the page** (this is set per-deployment)
- Inline validation (no alert dialogs) — red border + error text beneath the field

**6. Submit button**
```
[ Lock In My Plan ]   ← full width, orange
```
On submit: saves `{ email, city, meals: goal, date }` to localStorage → navigates to Impact view

---

## View 3: Impact

The volunteer sees their personal contribution history and has the option to share it.

### Celebration Banner (first-time submission only)
Shown only immediately after submitting for the first time in a session. Full-width navy block:

```
YOU'RE COMMITTED
[30]
SANDWICHES FOR YOUR COMMUNITY
Your plan is saved. Now go grab those supplies and show up.
————— (orange divider)
```

After this banner, the rest of the impact view renders below it.

### Scorecard
Three metric cards side by side:
- **Total Meals** — sum of all logged sandwich counts
- **Events** — total number of log entries
- **Top City** — the chapter city logged most often

### Journey Progress Bar
Navy card containing:
- Title: "Your Journey" / current total vs next milestone
- "Next milestone: X meals" — small muted text
- Animated progress bar (orange fill, animates in on view render)
- Contextual message — changes based on total meals reached:
  - 0: "Every sandwich you pack goes directly to a family in your community."
  - 25+: "You're making a real difference. Keep showing up."
  - 100+: "One hundred people ate because of what you brought."
  - 250+: "You've helped feed 250 people. That's the power of showing up month after month."
  - 500+: "Five hundred meals. Your commitment to this community is extraordinary."

### Community Milestones
Vertical list of milestone rows. Each row:
- Orange dot (filled when reached, gray when not)
- Name + description in human language
- Number (right-aligned, orange)
- Opacity: 0.32 when not reached, 1.0 when reached
- Orange left-border accent when reached

| Milestone | Description |
|---|---|
| First Contribution (25) | You showed up and made a real difference. |
| 100 Meals | A hundred people ate because of what you brought. |
| 250 Meals | Your consistency keeps this model alive month after month. |
| 500 Meals | Five hundred meals. That changes a community. |

### Contribution History
List of the volunteer's last 10 log entries, newest first:
- City name (left, navy, bold)
- Date (center, muted)
- Sandwich count (right, orange, Anton)

### Shareable Impact Card
Below the history, a "Share Your Impact" section:

**Button:** "Download My Impact Card" → generates a vertical PNG via Canvas API

**Canvas output dimensions:** 1080 × 1350px (4:5 ratio — standard Instagram portrait feed post)

**Card design:**
- Full navy background
- Top: Feed the City logo text (orange "FEED THE" / white "CITY") + chapter city name
- Hero section: volunteer's total meal count in massive Anton orange, "MEALS" below it
- Supporting stat line: "across [X] events"
- Progress context: which milestone they've reached (e.g., "100 MEAL MILESTONE")
- Milestone description in white italic
- A thin orange horizontal divider
- Bottom: a clean, branded tagline + "feedthecity.org"
- The whole card should feel bold, personal, and worth posting

**On mobile:** triggers native share sheet (iOS/Android) — volunteer can save directly to Photos or share to Instagram  
**On desktop:** downloads as `ftc-impact-[city]-[date].png`

### Footer Actions
```
[ Back to Shopping List ]   ← navy button

Log out / Switch account    ← small underline link, muted
```

Logout removes `ftc_email` and `ftc_logs` from localStorage only — does not clear any other browser data.

---

## Canvas API — Save Image (Grocery List)

The grocery list save image is a separate, simpler Canvas output for in-store reference.

**Dimensions:** 900 × variable height (grows with item count)

**Design:**
- Navy header: "FEED THE CITY" + "GROCERY LIST" + large orange sandwich count + "SANDWICHES"
- Orange 4px stripe at bottom of header
- White body: rows for each ingredient (emoji / item name left, quantity right in navy)
- Dashed separators between sandwich supplies and snack items
- Orange footer: "Feed the City" + "Thank you for showing up."

**Triggered from:** Log view → "Save Image" button  
**Mobile behavior:** Native share sheet → save to Photos  
**Desktop behavior:** Download PNG

---

## Planned: Supabase Backend

### Why it's needed
localStorage is device-specific. A volunteer who logs on their phone sees nothing if they check on their laptop. Supabase replaces localStorage with a real database, keyed by email address.

### What it enables
- Cross-device persistence — same history on any device
- Email-based lookup — "use same email as Eventbrite" becomes meaningful
- Aggregate data per chapter, per month (for Tango Charities reporting)
- Foundation for future features (reminders, community totals, etc.)

### Schema (planned, simple)

**`volunteer_logs` table:**
```
id          uuid (primary key)
email       text
chapter     text
meals       integer
logged_at   timestamp
```

### Future: Friday Reminder Email
Before the third Saturday of each month, a scheduled function (Supabase Edge Function + Resend or similar email provider) sends a reminder to any volunteer who has locked in a plan but not yet attended that month. Implementation deferred until Supabase is connected.

---

## Frontend Enhancement Notes

The existing implementation is plain HTML/CSS/JS. The following enhancements are explicitly in scope and encouraged if they improve the experience without increasing deployment complexity:

- **React** — acceptable if it improves component management and animation; must still deploy as a single embeddable file or Vercel URL
- **Glassmorphism** — acceptable as a surface treatment on cards (e.g., frosted glass on the impact card, subtle blur + white overlay); must remain legible and not clash with the orange/navy system
- **Micro-animations** — number pop on goal change, progress bar fill on view enter, card hover lifts — all encouraged
- **Framer Motion or similar** — acceptable for view transitions and milestone reveals
- **CSS custom properties** — already in use, should be preserved and extended

**Do not introduce:**
- New typefaces
- New primary colors outside the brand system
- Bottom navigation bars or persistent tab bars
- Anything that requires a native app or app store

---

## File Reference

The starting point for development is the existing HTML file from the previous iteration — specifically the version **before** the warning system and before the per-ingredient +/− adjustment buttons were added. That version had:
- Clean ingredient cards (image / number / separator / name / hint)
- Goal stepper with orange chevron arrows
- Snack steppers with circular +/− buttons
- Three-view flip flow (Plan → Log → Impact)
- Canvas-based grocery list save image
- localStorage-based impact tracking
- Celebration banner on first submission

Use that as the baseline. Do not start from scratch.

---

## Out of Scope (for now)

- Community event total logging (QR code form for event organizer) — separate tool, planned separately
- Push notifications
- Social login (Google/Apple) — email only for now
- Any server-side rendering
- Native mobile app
