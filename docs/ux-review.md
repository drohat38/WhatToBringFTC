# Feed the City — Volunteer Planner UX Review
*Reviewed April 17, 2026 · First-time volunteer perspective · CRO + UX analysis*

---

## What Was Reviewed

Three screenshots of the current volunteer flow:
1. **Screen 1 — Calculator (Plan):** Goal setter + ingredient cards
2. **Screen 2 — Lock In (Log):** City + email form gate
3. **Screen 3 — Receipt (Eventbrite):** Shopping list + registration CTA

---

## Issue 1 — Headline Copywriting

### Current
> **"HOW MANY SANDWICHES WILL YOU MAKE?"**

### The Problem
This is factually wrong about the FTC model. Volunteers **bring supplies**. The crowd **assembles sandwiches together** at the event. "Will you make?" implies the volunteer is personally constructing all 30 sandwiches alone — which is:

- **Misleading** about the community-assembly model
- **Potentially intimidating** ("I have to make 30 sandwiches by myself?")
- **Misses the mission** — FTC's value prop is community, not individual labor

### Recommendation
Change to: **"HOW MANY SANDWICHES WILL YOU HELP MAKE?"**

Adding "help" does three things: it accurately captures the community assembly model, reduces perceived personal burden, and keeps the goal-setting mindset intact. It fits on one line in the Anton font at the same size. This is a one-word fix with real conversion impact.

---

## Issue 2 — The Middle Screen Is a Conversion Killer

### Current Screen 2
A full-page interruption between the calculator and the shopping list that:
- Demands **city + email** before delivering the list
- Replaces rich ingredient imagery with a blank white form
- Uses the language **"Lock in your contribution"** — corporate-speak that doesn't match a volunteer's mental model

### The Problem: Demand Before Reward
The volunteer just spent time building excitement on Screen 1 — they picked their goal, they watched the ingredient quantities calculate dynamically, they're mentally committed. Then they hit a wall asking for personal information before they can see what they need to buy.

This is the classic gating anti-pattern. It signals: *"We want your data. The list is the ransom."* Every added step between intent and reward reduces completion rate.

**Additional context that makes this worse:** In every Wix iframe embed (the primary deployment surface — 46 city pages), the `?chapter=` URL parameter is already set. The city is already known. Asking the user to search for and select their city is pure redundant friction.

### Recommendation: Eliminate Screen 2 Entirely

New flow: **Calculator → Shopping List (direct)**

**City:** Auto-resolved from the `?chapter=` param (already works in every Wix embed). For the rare case of direct URL access without the param, show a compact inline city selector at the top of the Shopping List screen — not as a full-page gate.

**Email:** Move to an inline input *below the list, just above the Register button*. Frame it as a value exchange: *"Drop your email — we'll remind you before the event."* The user already has their list (reward delivered), so they're in a cooperative mindset. Friction is minimal. Email capture rate will likely be *higher* after this change, not lower, because it follows the reward.

**Outcome:** A first-time volunteer goes from Calculator → full Shopping List in a single click, with zero gates.

---

## Issue 3 — Animation Recommendation (React + Framer Motion)

If Screen 2 is eliminated, the transition from the large calculator cards to the compact receipt needs to feel choreographed and intentional. Here is the recommended sequence:

### The "Receipt Unfurl" — Three Beats

**Beat 1 — Calculator cards collapse (staggered exit)**
Each ingredient card exits with `y: 20, opacity: 0` with a 0.025s stagger delay per card, top to bottom. Duration 0.22s per card. The cards "fold up" as if being packed into a bag.

**Beat 2 — The Number Morphs (shared element transition)**
Use Framer Motion's `layoutId` on the goal number. The large orange **"30"** displayed in the calculator hero counter seamlessly morphs in position to become the **"30"** inside "Supplies for 30 sandwiches" in the receipt header. This is a single visual thread connecting the two states — the user's *decision* (the number) physically travels into their *receipt*.

This is the WOW moment. It says: "Your commitment just became a plan."

**Beat 3 — Receipt bubbles cascade in (staggered entrance)**
The receipt list items already have a stagger entrance animation (0.04s per item, 0.3s duration). This is good — keep it. The combined effect is: calculator folds, number flies, list builds itself.

**Why this works for the boss presentation:** It's a single orchestrated animation with a clear narrative arc. It doesn't feel like "we added some Framer Motion animations." It feels like the UI is *reacting* to the user's decision.

---

## Issue 4 — Shopping List Screen: Hierarchy Is Backwards

### Current Bottom Section Order
1. Utility buttons (Copy Shopping List | Save as Image)
2. REGISTER HERE → *(primary CTA)*
3. Plan another event *(reset)*

### The Problem
The primary conversion action — **Register** — is buried below two utility buttons. The visual hierarchy communicates that copying or saving the list is more important than actually registering. From a CRO standpoint, every pixel between the list and the Register button is a potential dropout.

### Recommended Order

| Position | Element | Notes |
|---|---|---|
| 1 | Receipt list | Unchanged |
| 2 | Email input | Small, single line. "Get a reminder before your event:" Optional-feeling, but captured. |
| 3 | **REGISTER HERE →** | Primary CTA. Increase height from 56px → 64px. This is the single most important button in the entire product. |
| 4 | Utility row | Save as Image (left, more prominent) · Copy List (right, less prominent) |
| 5 | Plan another event | Tiny muted text link. Escape hatch only — not a destination. |

### Additional Receipt Screen Tweaks

**Save as Image vs. Copy List priority:** Save as Image creates a shareable PNG artifact the volunteer can send to housemates or pin to their fridge. Copy List is a plain-text fallback. Save as Image drives more real-world utility and word-of-mouth — it should be the visually stronger button of the two.

**Add mission micro-copy under the receipt meta:** After the city and Saturday line, add *"~{n} families fed"* (where n = `Math.round(goal / 2)`). For a 30-sandwich goal this reads: *"~15 families fed."* This is a one-line emotional trigger that connects the supply calculation to the human outcome. It's the difference between "I'm buying bread" and "I'm feeding 15 families." This belongs on the receipt permanently.

**The receipt list items are clean** — plain white bubbles, item name left, orange quantity right. No decorative clutter. This is the right call; keep it as-is.

---

## Summary: What Stays, What Goes, What Changes

| Element | Decision | Reason |
|---|---|---|
| Ingredient calculator with images and dynamic quantities | **KEEP** | Strong, clear, premium |
| Large orange goal number with +/- controls | **KEEP** | Visual and interactive centerpiece |
| "HOW MANY SANDWICHES WILL YOU MAKE?" | **CHANGE** | Wrong model; one-word fix |
| Screen 2 "Lock in your contribution" gate | **KILL** | Demand-before-reward anti-pattern |
| Email capture | **KEEP, MOVE** | Move to inline on receipt screen, below the list |
| City selection | **KEEP, SIMPLIFY** | Auto from URL param; compact fallback only |
| PLAN → LOG → EVENTBRITE flow | **CHANGE to PLAN → EVENTBRITE** | Remove the intermediate step |
| Receipt shopping list bubbles | **KEEP** | Clean, correct — no changes needed |
| Action buttons order (Utility → CTA) | **INVERT** | CTA must come first after the list |
| Save as Image vs Copy priority | **SWAP** | Image is the higher-value action |
| "Plan another event" reset | **KEEP, DEMOTE** | Escape hatch, not a peer CTA |
| Families-fed micro-copy | **ADD** | Mission connection, high emotional ROI |

---

## Optimized User Journey (Final)

```
[Screen 1 — Calculator]
  → H1: "HOW MANY SANDWICHES WILL YOU HELP MAKE?"
  → User adjusts goal (30 sandwiches)
  → Ingredient cards update dynamically
  → Button: "LOCK IN YOUR CONTRIBUTION →"

     ↓ (direct — no gate)

[Screen 2 — Shopping List / Receipt]
  → "30" number morphs via shared animation from counter → receipt header
  → Full shopping list cascades in
  → Meta: "Denton, TX · Third Saturday · ~15 families fed"
  → [Email input]: "Drop your email — we'll remind you before the event"
  → [REGISTER HERE →]  ← 64px, full width, orange
  → [Save as Image] [Copy List]  ← utility row, secondary
  → Plan another event  ← tiny escape hatch
```

**Total screens:** 2 (down from 3)  
**Gates before delivering value:** 0 (down from 1)  
**Primary CTA position:** Immediately after the list (up from 3rd position)

---

*This review was prepared for the April 17 boss presentation.*
