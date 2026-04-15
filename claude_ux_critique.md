# Feed the City Planner — UX/UI Critique (Round 2)
**Captured:** 2026-04-13 | **Viewport:** 390×844 (iPhone 14) | **Branch:** claude-ui-fix

Fresh evaluation post all P0/P1 fixes from the prior audit. Headless Playwright, 2× DPR. Ratings: CRITICAL / HIGH / MEDIUM / LOW.

---

## Screen 1: Calculator View

### S1-1 HIGH — H1 orphan and question-mark framing
**HOW MANY SANDWICHES WILL YOU MAKE?** wraps across multiple lines with an orphaned trailing fragment. The question-mark framing softens what should be a directive instruction. Duolingo says "Day 3" — not "How many days have you practiced?"
- **Fix:** Shorten to `HOW MANY SANDWICHES?` — 4 words, no orphan risk, imperative.

### S1-2 HIGH — Horizontal ingredient scroll has no visual affordance
The ingredient strip scrolls horizontally on mobile. The only signal is the sliced cheese card clipping at the right edge. No gradient fade, no scroll dots, no swipe hint. Older volunteers will assume the strip ends there — Mustard and Sandwich Bags may never be seen.
- **Fix:** Add a right-edge CSS fade gradient (`::after` mask) and/or reduce card `flex-basis` from `148px` to `136px` to expose more of the next card as a peek affordance.

### S1-3 MEDIUM — Stepper increment amount not communicated
The stepper shows unlabeled chevron arrows in orange circles. Users cannot tell if each tap adds 1, 5, or 10. The nudge copy implies a range but not a step size.
- **Fix:** Label the buttons `−5` and `+5` as text, or add a subhint: *Each tap adjusts by 5.*

### S1-4 MEDIUM — CTA blurb copy is too verbose for mobile
The glassmorphism blurb reads: *"Ready to shop? Copy or save your list below to securely track your community impact and unlock your official grocery checklist."* — 20+ words after a full scroll. Users need an action, not a paragraph.
- **Fix:** Cut to one line: *Your list is ready. Copy it or save as an image before heading to the store.*

### S1-5 LOW — "Also Bring" section label is nearly invisible
`sec-hd--minor` renders at 9px / 50% opacity — looks like decorative whitespace rather than a content category label.
- **Fix:** Lift to 10px / 65% opacity, or use a full-width hairline divider + centered label.

### S1-6 LOW — Ingredient card descriptions are too dense at 148px
Descriptions like "Pre-packaged only — turkey, chicken, or ham. Organic preferred. No deli counter meat." are squeezed at this card width.
- **Fix:** Limit visible description to ~6 words with ellipsis overflow.

---

## Screen 2: LOG State — Receipt + Email Form

### S2-1 POSITIVE — Form fully visible without scrolling
All form elements visible within the 390×844 viewport without scrolling. Optimal for conversion.

### S2-2 POSITIVE — Field labels are present and legible
CITY and EMAIL labels render above inputs at 10px uppercase Open Sans. Correct accessibility pattern.

### S2-3 MEDIUM — Receipt list flattens sandwich vs snack categories
The calculator separates supplies from snack items in distinct sections. The receipt collapses them into one undifferentiated list (Sliced Bread through Tangerines in sequence). Users shopping from this list lose the categorical grouping.
- **Fix:** Add a subtle divider row or a 9px category label between Sandwich Bags and Large Chips in the receipt list.

### S2-4 MEDIUM — Sub-copy sets wrong expectation for this step
*"Select your city and enter your email to get your grocery checklist"* — but the user already saw the grocery list in the calculator. The real outcome is Eventbrite pre-fill. The copy undersells it.
- **Fix:** *"Select your city to get your personalized checklist and lock in your event spot."*

### S2-5 LOW — Spacing tight between receipt card and email section heading
After reducing `ec-label` from 22px to 18px, both Anton headings are the same size. The `border-top` separator helps but ~28px gap feels tight at equal visual weight.
- **Fix:** Add `margin-top: 8px` to `.ec-label`.

---

## Screen 3: Eventbrite Handoff / Success State

### S3-1 CRITICAL — Massive empty whitespace below "← Plan another event"
Visible content ends at roughly the **40% mark** of the viewport. The remaining **~60% is pure blank white space**. In a Wix iframe embed, this appears as a large white rectangle — it looks broken to event attendees and artificially inflates the iframe height.

**Root cause:** The `eb-reveal` component is short but the outer app container or Framer Motion wrapper maintains the height from the previous taller calculator state instead of shrinking to content.
- **Fix:** Ensure the outer container uses `height: auto` with no fixed/min-height. Fire `window.parent.postMessage({ type: 'ftc:resize', height: document.body.scrollHeight }, '*')` from `EventbriteReveal` `useEffect` to trigger iframe resize on the Wix parent.

### S3-2 HIGH — Button label casing mismatch (ALL CAPS vs Title Case)
Side by side: `COPY GROCERY LIST` (Anton, ALL CAPS) vs `Save Image` (Open Sans, Title Case). The casing contrast at 8px proximity is jarring. Fill vs outline already communicates hierarchy — the typographic split is redundant noise.
- **Fix:** Change `Save Image` label to `SAVE IMAGE` in JSX to match Anton uppercase, or make both Open Sans and rely on fill vs outline alone.

### S3-3 MEDIUM — Emoji icons render inconsistently cross-platform
The clipboard emoji renders flat gray on iOS/macOS. The floppy disk emoji renders colorful blue/purple on Windows. These look completely different cross-platform. The floppy disk is also a dated metaphor — users under 35 do not associate it with saving.
- **Fix:** Replace emoji with inline SVGs (16×16, `currentColor` stroke) for platform-consistent rendering.

### S3-4 MEDIUM — eb-card combined padding makes content feel too narrow
`eb-card` (20px sides) + `eb-reveal` (20px sides) = 40px each side on a 390px screen, leaving only 310px usable width. The calculator cards felt wider.
- **Fix:** Reduce `eb-reveal` side padding from `20px` to `12px`.

### S3-5 LOW — eb-title uses --navy variable against documented intent
Per CLAUDE.md, `--navy` is reserved for canvas/image outputs only. `.eb-title` uses `color: var(--navy)` — CSS variable hygiene issue.
- **Fix:** Change `.eb-title` to `color: var(--text)`.

### S3-6 POSITIVE — Primary/secondary button hierarchy is correct
Copy Grocery List (solid orange) vs Save Image (ghost/outline) correctly reflects action priority. Prior issue resolved.

### S3-7 POSITIVE — "← Plan another event" reset link is clean
Low-priority escape hatch with border-top separator. Non-intrusive. Correct pattern.

---

## Cross-Cutting Issues

### X1 CRITICAL — iframe resize postMessage not wired to state changes
`window.parent.postMessage({ type: 'ftc:resize', height: document.body.scrollHeight }, '*')` must fire on every flow state change. Without it, the Wix iframe maintains the tall calculator height even in the shorter success state — compounding S3-1.
- **Fix:** In `App.jsx` or each view's `useEffect`, fire the resize message after state change + animation settle (~400ms).

### X2 HIGH — No persistent back navigation across state changes
Once past the calculator, the only escape is a text link at the bottom of each screen. Users who want to go back must scroll down to find it.
- **Fix:** Add a sticky mini-header (28–32px) with brand mark + back arrow that appears only in LOG and EVENTBRITE states.

### X3 MEDIUM — No loading state between form submit and success
Form submission transitions directly to success animation. On a slow mobile connection (Wix embed, 3G), there may be a visible freeze with no user feedback.
- **Fix:** Disable `ec-submit` + change text to `Saving…` for 300ms between click and `onLogSubmit()` call.

### X4 POSITIVE — Typography system is consistent and legible
Anton and Open Sans render correctly at all weights. No FOUT observed.

### X5 POSITIVE — Color discipline maintained in the UI layer
Orange used only for CTAs, accent numbers, and active states. No dark backgrounds or navy fills in UI. Wix embed integration will be clean.

---

## Priority Summary

| ID   | Severity | Issue                                                    | Screen |
|------|----------|----------------------------------------------------------|--------|
| S3-1 | CRITICAL | ~60% blank whitespace below success state content        | 3      |
| X1   | CRITICAL | iframe resize postMessage not firing on state change     | Cross  |
| S1-1 | HIGH     | H1 orphan + question-mark framing weakens authority      | 1      |
| S1-2 | HIGH     | Horizontal ingredient scroll has no visual affordance    | 1      |
| S3-2 | HIGH     | Button label casing mismatch (ALL CAPS vs Title Case)    | 3      |
| X2   | HIGH     | No persistent back navigation header across states       | Cross  |
| S1-3 | MEDIUM   | Stepper increment amount not communicated to user        | 1      |
| S1-4 | MEDIUM   | CTA blurb copy is too verbose for mobile                 | 1      |
| S2-3 | MEDIUM   | Receipt list collapses sandwich/snack categories         | 2      |
| S2-4 | MEDIUM   | Sub-copy sets wrong expectation for step outcome         | 2      |
| S3-3 | MEDIUM   | Emoji icons render inconsistently cross-platform         | 3      |
| S3-4 | MEDIUM   | eb-card combined padding makes content feel too narrow   | 3      |
| X3   | MEDIUM   | No loading state between form submit and success         | Cross  |
| S1-5 | LOW      | Also Bring section label nearly invisible at 9px/50%     | 1      |
| S1-6 | LOW      | Card description text too dense at 148px card width      | 1      |
| S2-5 | LOW      | Spacing tight between receipt card and email heading     | 2      |
| S3-5 | LOW      | eb-title uses --navy variable against documented intent  | 3      |
