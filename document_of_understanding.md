# Feed the City — Document of Understanding
### UI/UX Audit · Integration Strategy · Design Roadmap
*Prepared: April 9, 2026 | Auditor: Claude (AI Systems Analyst)*

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Visual Audit — All Views & States](#2-visual-audit--all-views--states)
3. [The Event Page & Volunteer Flow](#3-the-event-page--volunteer-flow)
4. [Iframe Integration Strategy](#4-iframe-integration-strategy)
5. [The Double-Email Problem](#5-the-double-email-problem)
6. [UI/UX Recommendations](#6-uiux-recommendations)
7. [Future Capabilities & Roadmap](#7-future-capabilities--roadmap)

---

## 1. Project Overview

### What Is This?

**Feed the City** is a volunteer contribution planner and impact tracker built for [Tango Charities](https://tangocharities.org). Volunteers who attend "Feed the City" events bring raw grocery supplies (bread, deli meat, cheese, mustard, bags, chips, tangerines) that are assembled into sandwich meals distributed to families in need.

The app solves a real coordination problem: *volunteers don't know exactly how much to buy*. The tool calculates precise quantities, generates a downloadable grocery checklist, and tracks each volunteer's lifetime meal contribution.

### What We Have Built

| Layer | Technology | Status |
|---|---|---|
| Stack | Vanilla HTML + CSS + JS | ✅ Complete |
| Hosting | Static file — deployable anywhere | ✅ Ready |
| State | `localStorage` (client-side only) | ✅ Functional |
| Data persistence | None (no backend) | ⚠️ By design for now |
| Deployment target | Wix iframe embed | 🔄 Pending |
| Backend / DB | Supabase (future) | 🔜 Not yet |

### Three Core Views
```
view-main  →  view-log  →  view-impact
  (Plan)        (Log)        (Impact)
```

The app is entirely client-side. State lives in `localStorage` under two keys:
- `ftc_email` — the volunteer's email (persists across sessions)
- `ftc_logs` — array of `{ meals, date, chapter }` entries

---

## 2. Visual Audit — All Views & States

### 2.1 Main View (Plan)

**What the user sees on first load:**

- **3-step progress bar** at top: Plan → Log → Impact (tiny, low-contrast — see Recommendations)
- **Hero goal setter**: Large orange number (default: 30), flanked by orange circle +/− buttons
- **"How many sandwiches" heading** in Oswald/uppercase navy — long, wraps on small screens
- **"tap to edit" hint** below the number (redundant UX noise — see Recommendations)
- **Ingredient grid (Sandwich Supplies)**: 5 items in a 2×2+1 centered layout
  - Sliced Bread · Deli Meat · Sliced Cheese · Yellow Mustard · Sandwich Bags
  - Each card: product image, name, computed quantity with unit, fine-print hint
  - Cards have hover lift animation + glare sweep effect
- **"Also Bring" section**: Chips + Tangerines in a 2-col grid
- **CTA block** (bottom):
  - Statement: "These supplies make **30** sandwiches."
  - Subtext: instruction copy
  - Blue-bordered blurb card prompting the Log action
  - **Primary CTA**: "Log Impact & Get Grocery List →" (orange gradient, 60px tall)
  - **Secondary CTA**: "View my impact history" (text button)
- **Background**: Subtle warm orange-to-white-to-navy-tint radial gradient — premium feel

**Computed quantities (for goal = 30):**
| Item | Quantity | Formula |
|---|---|---|
| Sliced Bread | 3 loaves | `ceil(g/10)` |
| Deli Meat | 60 oz | `g × 2` |
| Sliced Cheese | 30 slices | `g × 1` |
| Yellow Mustard | 1 bottle | `ceil(g/50)` |
| Sandwich Bags | 1 box | `ceil(g/50)` |
| Chips | 1 bag | `max(1, floor(g/20))` |
| Tangerines | 1 bag (3 lb) | `max(1, floor(g/20))` |

---

### 2.2 Log View (Lock In Your Plan)

**What the user sees after tapping "Log Impact & Get Grocery List":**

- **Back button** (top-left, small)
- **"Lock In Your Plan"** — Anton font heading, navy
- **Commitment card**: Dark navy card with shine effect, showing sandwich count in large orange
  - "YOUR COMMITMENT", "YOU'RE BRINGING SUPPLIES FOR", **30**, "SANDWICHES"
  - "Your community is counting on you." — emotionally compelling
- **Email field**:
  - Label: "Email Address"
  - Placeholder: `email@example.com`
  - Helper text: *"Use the same email as your Eventbrite registration."*
  - Error state: red border + "Please enter a valid email address."
- **City picker**:
  - Custom dropdown (not native `<select>`) — searchable
  - Defaults to **Denton, TX** (hardcoded `selected` attribute — correct for Denton page)
  - Lists ~47 Feed the City chapter cities
  - Has its own inline error state
- **Submit CTA**: "I'm In — Save My Plan" (full-width orange gradient button)

**On submission:**
1. Validates email format + city selection
2. Saves `ftc_email` to localStorage
3. Appends `{ meals, date, chapter }` to `ftc_logs`
4. Transitions to Impact view with `fromSubmission = true`

---

### 2.3 Impact View (After First Submission)

**Celebration Banner (shown only immediately after submit):**
- Full-width orange header: "30 SANDWICHES FOR YOUR COMMUNITY"
- Subtext: "Your plan is saved. Now go grab those supplies and show up at the event."
- Two ghost buttons: **"Copy Grocery List"** | **"Save Grocery Image"**

**Lifetime Impact Section (sky-blue gradient hero area):**
- Label: "LIFETIME IMPACT"
- **Journey Card**: white card with circular SVG progress ring
  - Orange arc fills proportionally toward next milestone
  - Center: current meal count (animated count-up from 0)
  - Right: "NEXT: 100 MEALS" + motivational message

**White Bottom Sheet:**
- **Scorecard**: Total Meals | Events | Top City — three stat cards
- **Community Milestones**: vertical timeline
  - "First Contribution" — ✅ reached (checkmark, filled dot)
  - "100 Meals" — 🎯 next target (orange ring dot, orange count)
  - (250 and 500 milestones hidden until closer)
- **Contribution History**: collapsible `<details>` element
- **Download My Impact Card** — orange full-width button
- **Back to Calculator** · **Log out** — text links at bottom

**Impact Card (Canvas Output):**
- 1080×1350px (Instagram 4:5 ratio)
- White background with sky-blue radial glow + orange top arc accent
- "FEED THE CITY · TANGOCHARITIES.ORG" eyebrow
- City badge in navy pill
- Giant orange hero number (meal count)
- "MEALS" in navy Anton
- Milestone badge (orange pill)
- Stats trio bento card (sky-blue tint)
- Navy footer

**Grocery List Card (Canvas Output):**
- 900px wide
- Navy header with diagonal orange accent
- Item name left / orange quantity right layout
- "ALSO BRING" section divider for snacks
- Navy footer

---

### 2.4 Impact View (Returning User — No Submission)

When a logged-in user taps "View my impact history":
- Celebration banner is **hidden**
- Journey ring and scorecard pull from all accumulated `ftc_logs`
- History is shown in the collapsible section
- If no logs exist: empty-state card ("Your impact journey starts here.") with "Plan My First Contribution" CTA

---

## 3. The Event Page & Volunteer Flow

### Tango Charities Denton Page Structure

The page at `https://www.tangocharities.org/feed-the-city-denton` is a **Wix Thunderbolt** rendered site. Based on structural analysis, the standard page layout is:

```
┌─────────────────────────────────────────┐
│  TANGO CHARITIES  NAV (sticky)          │
├─────────────────────────────────────────┤
│  HERO BANNER — Feed the City Denton     │
│  (event title, date, location)          │
├─────────────────────────────────────────┤
│  ABOUT THE EVENT (copy block)           │
├─────────────────────────────────────────┤
│  ⚠️  WHAT TO BRING (static list) ←───── │  ← REPLACEMENT TARGET
│  (currently: plain text or image list)  │
├─────────────────────────────────────────┤
│  UPCOMING DATES (accordion or list)     │
├─────────────────────────────────────────┤
│  EVENTBRITE WIDGET (embedded)           │
│  [Register for Specific Date]           │
├─────────────────────────────────────────┤
│  FAQ / FOOTER                           │
└─────────────────────────────────────────┘
```

### The Volunteer Journey (Current State)

```
Step 1  →  Discover the event (social media / email / word of mouth)
Step 2  →  Land on tangocharities.org/feed-the-city-denton
Step 3  →  Read about the event in the hero copy
Step 4  →  Read the "What to Bring" section (passive, static list)
Step 5  →  Scroll to Upcoming Dates — pick a Saturday
Step 6  →  Click into Eventbrite widget
Step 7  →  Register email + name for their chosen date
Step 8  →  Receive Eventbrite confirmation email
Step 9  →  Go to grocery store (no guided list)
Step 10 →  Show up at event with supplies
Step 11 →  Zero post-event tracking or acknowledgment
```

**Pain Points in Current Flow:**
- Step 4 is entirely passive. A plain "bring 2 loaves of bread" list creates no commitment.
- Step 9 has zero scaffolding — volunteers guess quantities, often under-buy.
- Step 11 leaves no emotional imprint. Volunteers have no record of their contribution.

### The Volunteer Journey (With Our Iframe)

```
Step 1  →  Discover the event
Step 2  →  Land on tangocharities.org/feed-the-city-denton
Step 3  →  Read event hero
Step 4  →  Encounter iframe: "How many sandwiches will you bring supplies for?"
Step 5  →  Interact with the calculator — personalize their commitment
Step 6  →  Tap "Log Impact & Get Grocery List" — enter email + city
Step 7  →  See personalized commitment card + grocery list + impact card
Step 8  →  Copy grocery list OR save the image to their phone
Step 9  →  Scroll down to Eventbrite — register for a specific date
Step 10 →  Go to store WITH the checklist
Step 11 →  Show up at event
Step 12 →  Return to the page next month — see accumulated impact
```

**The iframe transforms Step 4 from a passive read into an active commitment ritual.**

---

## 4. Iframe Integration Strategy

### Placement Recommendation

> **REPLACE** the static "What to Bring" section entirely with the iframe.

Do not add the iframe *beside* or *below* the static text. The iframe *is* the "What to Bring" section — richer, dynamic, and personalized. The old static copy becomes redundant.

**Ideal position**: Directly after the event description copy, **before** the Upcoming Dates / Eventbrite section. This way:
1. User reads what Feed the City is about
2. Immediately commits to a quantity (emotional buy-in)
3. Scrolls down to pick a specific date and register

### Wix Embed Code

In Wix editor: Add → Embed → Embed a Website (HTML iFrame)

```html
<iframe
  src="https://your-deployment-url/index.html"
  width="100%"
  height="900"
  frameborder="0"
  scrolling="no"
  style="border:none; border-radius:16px; overflow:hidden;"
  title="Feed the City — Volunteer Planner"
  loading="lazy"
></iframe>
```

**Critical iframe configuration notes:**

| Setting | Recommendation | Reason |
|---|---|---|
| `scrolling="no"` | Required | The app uses `postMessage` to control parent scroll — native scrolling inside iframe creates double-scroll trap |
| `height` | Set to ~900–1100px | The main view full content is ~1100px tall. Static height avoids layout shifts. |
| `allow="clipboard-write"` | Add | Required for "Copy Grocery List" button on some browsers |
| `allow="web-share"` | Add | Required for native share sheet on iOS (Save Image) |
| `border-radius` | 12–16px | Softens the embed to match Wix page aesthetic |

**The app already handles iframe context correctly:**
```js
// script.js — existing postMessage integration
if (window.parent !== window) {
  window.parent.postMessage({ type: 'scroll', y: 0 }, '*');
}
```
This resets parent page scroll to top on view transitions, which is the right behavior. The parent Wix page needs a `message` listener to act on this, but even without it, the app degrades gracefully.

### Dynamic Height via postMessage (Recommended Enhancement)

Instead of a fixed iframe height, implement dynamic resizing so the parent page adapts as the user moves between views (log view is shorter; impact view is taller):

**In the app (script.js — future addition):**
```js
function postH() {
  var h = document.documentElement.scrollHeight;
  if (window.parent !== window) {
    window.parent.postMessage({ type: 'resize', height: h }, '*');
  }
}
```

**In the Wix custom code (parent page):**
```js
window.addEventListener('message', function(e) {
  if (e.data && e.data.type === 'resize') {
    document.querySelector('iframe[title="Feed the City"]').style.height = e.data.height + 'px';
  }
});
```

> The app already calls `postH()` after every view switch — this just needs the corresponding parent listener.

### Iframe Friction Points

| # | Issue | Severity | Fix |
|---|---|---|---|
| 1 | Fixed height causes whitespace or cutoff depending on view | High | Dynamic postMessage height OR set to ~1100px |
| 2 | `localStorage` is sandboxed per origin — email won't carry to Eventbrite | Medium | URL param hand-off (see §5) |
| 3 | Native share sheet (`navigator.share`) may be blocked in cross-origin iframe | Medium | Add `allow="web-share"` attribute |
| 4 | Clipboard API may be blocked without explicit permission | Medium | Add `allow="clipboard-write"` attribute |
| 5 | Wix's mobile editor may clip or overflow the iframe | Medium | Test in Wix mobile preview; may need separate mobile height |
| 6 | City picker dropdown could overflow iframe bounds if iframe is short | Low | Dropdown max-height + scroll already handles this |
| 7 | Font loading (Google Fonts) inside iframe adds ~200ms cold start | Low | No fix needed — fonts load once and are cached |
| 8 | If user has cookies/localStorage blocked, no state persists | Low | Show empty state gracefully — already handled |

---

## 5. The Double-Email Problem

### The Problem, Precisely Stated

```
EMAIL #1  →  Entered in our app (Log view)
               Purpose: Track lifetime impact, generate Impact Card
               Stored in: localStorage (client-only)
               Seen by: No one — purely local

EMAIL #2  →  Entered in Eventbrite widget (below the iframe)
               Purpose: Event registration, confirmation email, attendance tracking
               Stored in: Eventbrite's database
               Seen by: Tango Charities event coordinators
```

A volunteer must enter their email **twice** on the same page visit. These two entries are currently completely disconnected — our app has no idea whether the person registered on Eventbrite, and Eventbrite has no idea the person planned sandwich quantities.

This is a real friction point because:
- It feels redundant and confusing ("Why do they need my email again?")
- It creates two separate identity records with no linking mechanism
- If we ever want to verify impact claims against actual attendance, we have no data bridge

### Proposed Solutions — Ranked by Implementation Effort

#### Solution A: Psychological Reframing (Effort: Zero — Do This Now)

Change the language in the Log view to make dual-entry feel intentional and purposeful:

**Current copy:**
> "Use the same email as your Eventbrite registration."

**Improved copy (Option 1 — Future-Forward):**
> "Enter your email to create your lifetime impact profile. This is separate from event registration — use the same address for easy tracking."

**Improved copy (Option 2 — Two-Step Framing):**
> "Step 1 of 2: Create your impact profile. You'll register for a specific event date in Step 2 below."

Add a visual connector after the impact view CTA — a downward arrow or numbered step indicator that explicitly says:
> "↓ Step 2: Scroll down to confirm your spot at the next event."

**This costs zero engineering effort and eliminates 80% of the confusion.**

---

#### Solution B: URL Parameter Pre-fill for Eventbrite (Effort: Low-Medium)

After saving their plan, present a deep-link CTA button in the celebration banner:

```
┌─────────────────────────────────────────────┐
│  ✅  Your plan is saved!                     │
│                                             │
│  [ Copy Grocery List ]  [ Save Image ]      │
│                                             │
│  ┌─────────────────────────────────────────┐│
│  │ ↓  Step 2: Reserve Your Spot           ││
│  │  Register for the next event →         ││
│  └─────────────────────────────────────────┘│
└─────────────────────────────────────────────┘
```

The button uses `window.parent.postMessage` to communicate the email upward to the host page, which then:
1. Scrolls down to the Eventbrite section
2. (If Eventbrite supports it) Pre-fills the email field via their embed API

**Eventbrite URL pre-fill (works for direct links, not embeds):**
```
https://www.eventbrite.com/e/[EVENT-ID]/register?email=user@example.com
```

**For embedded widgets**, Eventbrite's JS API has limited pre-fill support. An alternative is to scroll the user to the Eventbrite iframe and display a toast: *"Enter the same email below to complete your registration."*

---

#### Solution C: Single-Email Architecture via URL Parameters (Effort: Medium)

Tango Charities could add a query parameter to their Eventbrite confirmation emails or registration links. When a volunteer clicks from our app to Eventbrite:

1. Our app appends `?ftc_email=user@example.com&ftc_meals=30` to the Eventbrite URL
2. A Wix Velo (or simple JS) script reads these params and pre-fills the form

This requires coordination with the Eventbrite setup but eliminates the manual re-entry completely.

---

#### Solution D: Supabase-Linked Identity (Effort: High — Future Phase)

When Supabase is integrated:
1. Our app creates/upserts a volunteer record on submission: `{ email, chapter, logs[] }`
2. Eventbrite webhooks (or manual export) update the same record with `{ registered: true, event_date }`
3. The impact card can then distinguish "committed" vs. "actually attended"

This is the ideal end state but is correctly deferred.

---

### Recommended Immediate Action

**Implement Solution A + B now.** The combined effect:
- Reframe the copy to make dual-entry feel logical (A)
- Add a "Step 2: Reserve Your Spot" button in the celebration state that scrolls the parent page to the Eventbrite section (B)
- Total engineering effort: ~2 hours

---

## 6. UI/UX Recommendations

Based on the visual audit, here are expert critiques organized by priority:

### 🔴 Priority 1 — Fix Immediately

**6.1 — The 3-Step Progress Indicator Is Nearly Invisible**
- Current state: Tiny pill-shaped steps at the very top. Font size ~10px. Very low visibility.
- In an iframe context, users who scroll past the top of the embed on mobile will have zero orientation.
- **Fix**: Make the step indicator sticky within the iframe, or increase size significantly (minimum 14px, icon + text, bolder active state). Alternatively, move it inline within each view's header.

**6.2 — Main View Heading Is Too Long for Mobile**
- "HOW MANY SANDWICHES WILL YOU PROVIDE SUPPLIES FOR?" wraps to 3 lines on 390px width.
- The heading loses punch when it wraps.
- **Fix**: Shorten to **"HOW MANY SANDWICHES WILL YOU BRING SUPPLIES FOR?"** or break into two lines with intentional typographic hierarchy:
  - Line 1 (small, muted): "You're coming to Feed the City."
  - Line 2 (large, bold): "How many sandwiches?"

**6.3 — "tap to edit" Hint Is Redundant Clutter**
- The hint appears below the number but the +/− buttons already do the heavy lifting.
- The hint is 8px text and barely visible — it does nothing for discoverability.
- **Fix**: Remove entirely. Or show only on first visit via a brief tooltip animation.

**6.4 — Ghost Buttons in Celebration Banner Are Too Subtle**
- "Copy Grocery List" and "Save Grocery Image" are white-outlined ghost buttons on an orange background.
- These are the primary actions in the most critical moment of the user journey — but they look secondary.
- **Fix**: Make one of them a solid white button (primary) and one ghost (secondary). The Copy action should be primary since it requires no permissions. Or stack them vertically with more visual weight.

---

### 🟡 Priority 2 — High Impact, Implement Soon

**6.5 — No Visible "Step 2" Prompt After Plan Submission**
- After the volunteer saves their plan, they're in the impact view. There is zero indication that they need to scroll the parent page to register on Eventbrite.
- **Fix**: Add a persistent "Step 2: Register for your date →" CTA within the celebration view (below the grocery list buttons). This CTA sends a `postMessage` to the parent to scroll to Eventbrite.

**6.6 — City Picker Defaults to Denton Correctly — But Visually Unclear**
- The city picker shows "Denton, TX" pre-selected which is correct for the Denton embed.
- However, there's no visual indication of *why* this is pre-selected or that it can be changed.
- **Fix**: For a dedicated Denton page embed, **lock the city field and hide it**. Display: "Denton, TX 📍" as a non-editable badge. This removes a field entirely from the form — reducing cognitive load.

**6.7 — The CTA Blurb Is Confusing**
- The blurb: *"Unlock your official grocery checklist to bring to the store — and track your community impact every month."*
- The word "unlock" implies a gate or barrier. Combined with "every month" it creates a subscription-like anxiety.
- **Fix**: *"Get your personalized grocery checklist and see your community impact — for free, every time you volunteer."*

**6.8 — Celebration Banner Needs More Emotional Celebration**
- "Your plan is saved. Now go grab those supplies and show up at the event." reads like a task manager confirmation.
- This is the emotional peak of the user's journey — they just committed to feeding 30 people. Celebrate it.
- **Fix**: Add a brief confetti animation (CSS-only, 0.5s) and rewrite the copy:
  - Headline: **"You're in. 🧡"** or **"Your community thanks you."**
  - Body: *"30 meals are on the way because of you. Here's your grocery list — bring it to the store and show up Saturday."*

**6.9 — Ingredient Cards Have No Interactivity Hint**
- The cards have beautiful hover effects but give no touch/mobile affordance.
- On mobile, users may not realize the numbers are reactive to the goal slider.
- **Fix**: Add a subtle pulse animation to the numbers when the goal changes (already has `animPop` — verify it's noticeable enough on mobile).

---

### 🟢 Priority 3 — Polish & Refinement

**6.10 — Impact View: "Contribution History" is Hidden by Default**
- Good for clean UI, but first-time users may not know their log was saved.
- **Fix**: Auto-expand the history immediately after first submission, then allow collapse on subsequent visits.

**6.11 — The "Log out" Link Is Confusingly Placed**
- "Log out" appears as a small text link at the very bottom of the impact view next to "Back to Calculator."
- There's no "account" — it simply clears localStorage. The label is misleading.
- **Fix**: Rename to **"Reset / Switch Volunteer"** or **"Clear my data"** with a confirmation dialog. "Log out" implies an account system that doesn't exist yet.

**6.12 — The Progress Ring Milestone Logic Shows Only 2 Milestones**
- The code intentionally shows only the `reached` milestone and the `next` milestone, hiding the others.
- For a first-time user at 30 meals, this means only "First Contribution" (reached) and "100 Meals" (next) are visible.
- **Fix**: Consider showing a grayed-out "preview" of all 4 milestones to give users a sense of the full progression — creates aspirational pull.

**6.13 — No Loading State on Canvas Generation**
- "Download My Impact Card" triggers canvas rendering which can take 1–2 seconds.
- The button text changes to "Building…" but the button still looks the same.
- **Fix**: Add a subtle spinner (CSS `@keyframes rotate`) inside the button during build.

**6.14 — The App Has No Logo / Brand Mark**
- The main view has no Tango Charities or Feed the City logo — just text.
- Inside an iframe on a Tango Charities page, the brand connection is weak.
- **Fix**: Add a small "Feed the City" wordmark + heart icon at the top of the main view, above the 3-step indicator.

---

## 7. Future Capabilities & Roadmap

### Unlocked by the Iframe Architecture

The fact that this is a modular, embeddable iframe opens significant possibilities:

| Capability | Description | When |
|---|---|---|
| **Multi-city deployment** | One codebase, different `?chapter=denton` URL param pre-selects city | Now |
| **Community progress meter** | "Denton has committed 1,200 / 3,000 meals for March" — requires Supabase | Phase 2 |
| **Coordinator dashboard** | Internal view showing committed totals per event, per city | Phase 2 |
| **Instagram card sharing** | Impact card + "Tag @tangocharities" CTA — organic social amplification | Now (already built) |
| **Sponsor injection** | Add event sponsor logo to generated impact cards | Phase 2 |
| **Pre-filled via Eventbrite** | Eventbrite confirmation email includes link to auto-load user's plan | Phase 3 |
| **SMS reminders** | 2 days before event: "You committed 30 meals — here's your grocery list!" | Phase 3 |
| **Leaderboard view** | "Top contributors in Denton this month" — gamification for retention | Phase 2 |
| **QR code at events** | Physical QR code → loads app → volunteer logs retroactively | Now |

### Technical Debt to Address Before Launch

1. **No HTTPS enforcement** — the static site must be served over HTTPS for `localStorage`, `navigator.share`, and `clipboard-write` to function in cross-origin iframes.
2. **postH() is called for height but parent has no listener** — add postMessage height listener to Wix Velo code.
3. **No error handling on canvas font load** — if Google Fonts fail, the canvas cards will render with fallback fonts. Add a timeout fallback.
4. **City list is hardcoded in HTML** — should be a JSON array driven by a config, making multi-city deployment easy.
5. **No analytics** — zero visibility into how many users interact with the tool. Add a lightweight analytics call (Plausible or Fathom — privacy-first, no GDPR friction) on key events: `goal_set`, `log_submitted`, `impact_card_downloaded`.

### The Instagram Card Phase (Next Design Priority)

The `buildImpactCanvas()` function already generates a 1080×1350px (4:5 ratio) impact card with:
- Giant orange meal count
- Milestone badge
- Stats trio bento box
- City badge
- Brand footer

**Current gaps for Instagram optimization:**
- No volunteer name on the card (privacy-safe but impersonal)
- No event-specific branding (generic "Feed the City" — could say "Denton April 2026")
- No social call-to-action on the card itself ("Tag @tangocharities and inspire others!")
- The card uses Anton + Open Sans — correct and on-brand, but the layout could be more Instagram-native

**Recommended Figma work for the card redesign:**
1. Define 3 card variants: First Timer / Milestone Reached / Legend (500+ meals)
2. Design for story format (9:16) as well as feed format (4:5)
3. Include a "Share to Stories" button on mobile (uses `navigator.share` with the canvas blob)

---

## Summary — Action Priority Matrix

| Priority | Item | Effort | Impact |
|---|---|---|---|
| 🔴 P1 | Reframe dual-email copy — "Step 1 of 2" language | 30 min | High |
| 🔴 P1 | Add "Step 2: Register →" postMessage CTA button | 2 hr | High |
| 🔴 P1 | Fix ghost buttons in celebration banner | 30 min | High |
| 🔴 P1 | Make step progress indicator visible | 1 hr | Medium |
| 🟡 P2 | Lock/hide city field for Denton embed | 1 hr | Medium |
| 🟡 P2 | Rewrite celebration banner copy | 30 min | High |
| 🟡 P2 | Add confetti on submission | 2 hr | Medium |
| 🟡 P2 | Rename "Log out" to "Reset volunteer" | 15 min | Medium |
| 🟡 P2 | Fix CTA blurb copy | 15 min | Low |
| 🟢 P3 | Auto-expand contribution history post-submit | 30 min | Low |
| 🟢 P3 | Show all 4 milestones (grayed-out future ones) | 1 hr | Medium |
| 🟢 P3 | Add brand mark / logo to main view top | 1 hr | Medium |
| 🟢 P3 | Canvas generation loading spinner | 30 min | Low |
| 🔜 Future | Supabase integration | Large | Very High |
| 🔜 Future | Community progress meter | Medium | Very High |
| 🔜 Future | Analytics (Plausible) | Small | High |

---

*This document is the master reference for all design, engineering, and integration decisions going forward. Update as the product evolves.*
