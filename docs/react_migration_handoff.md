# Architecture Update & Handoff for Claude Code

Hello Claude! This document serves as a brief update on the recent UI/UX iterations and our strategic plan to move to a new technology stack. Please read this to get up to speed on the current state of the project before executing new tasks.

## 1. The Latest Baseline (`ftc-planner-htmlfile (1).html`)

A new file, **`ftc-planner-htmlfile (1).html`**, has just been added to the root of the project. 

*   **What it is:** This file represents the absolute latest stable iteration of the UI and UX. It includes all the recent styling updates, glassmorphism UI adjustments, and the consolidated layout where everything acts as a single flow.
*   **Why it matters:** You should treat this file as the primary reference for how the application is supposed to look and behave right now instead of the older `planner/index.html` or `planner/script.js` setups.

## 2. Solving the "Double Email" Friction

We recently discussed the friction of requiring volunteers to enter their email once for our impact tracking and a second time for Eventbrite registration.
*   **The Strategy:** Our plan involves a unified flow. We capture the user's email *before* showing Eventbrite, linking their email to their meal commitment (e.g. 30 sandwiches) in a backend database (eventually Supabase).
*   **The Handoff:** Once we capture the email, the Eventbrite widget is revealed. If supported, we will pass the captured email into the Eventbrite widget / URL to pre-fill the registration step and eliminate the double-entry problem.

## 3. The Big Shift: Moving to React + Framer Motion

We have decided that maintaining complex view-switching and "sick" animations in Vanilla JS (`script.js`) has reached its limit. We are officially pivoting the project to a **React + Vite** setup.

*   **Why React?** It will make managing the multi-step form state (Calculator -> Email Capture -> Impact/Eventbrite view) much cleaner.
*   **Why Framer Motion?** We want a premium, seamless "Collapse" layout animation. When the user finishes the calculator, we want the entire large hero component to elegantly morph/shrink into a small "Summary Receipt" at the top of the screen to make room for the email and Eventbrite views. This is incredibly difficult in Vanilla CSS but heavily optimized in Framer Motion. 
*   **Wix Integration:** The final React app will still be hosted on something like Vercel and completely compatible as a Wix iframe embed.

### Next Steps...

The user will provide a specific prompt for you regarding the actual migration steps later. For now, just be aware of the changes in `ftc-planner-htmlfile (1).html` and mentally prepare for the transition to React components!
