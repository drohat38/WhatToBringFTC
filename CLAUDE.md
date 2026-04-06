# FTC Planner — Claude Instructions

## Frontend Visual Rules: The Screenshot Loop

**MANDATORY:** Whenever you are asked to modify HTML/CSS, Canvas styling, or any UI elements, you MUST follow this loop before finalizing code:

1. Spin up a local preview server (`npx serve .` or a Playwright script)
2. Open the page in a headless browser (Playwright + Chrome at `C:/Program Files/Google/Chrome/Application/chrome.exe`)
3. Take a screenshot using your vision tools and READ the resulting image
4. Analyze the screenshot against these standards:
   - **Alignment:** Are elements properly aligned? No orphaned items.
   - **Spacing:** Is there generous, consistent whitespace? No cramped sections.
   - **Typography:** Is hierarchy clear? Numbers > labels, headings > body.
   - **Color:** Does it use the brand palette (Orange `#FF6500`, Navy `#003366`, Sky Blue `#3BAEE8`, White)?
   - **Premium feel:** Does it look like a modern SaaS product (Strava, Duolingo, Notion)?
5. Iterate on the CSS/HTML based on what you see
6. Take another screenshot and repeat until it looks excellent

**NEVER code UI blindly.** Do not finalize any visual change without at least one screenshot review.

## Project Context

- **Stack:** Vanilla HTML/CSS/JS — no framework, no build step
- **Files:** `index.html`, `style.css`, `script.js`, `ftc_v3.html` (synced copy)
- **Brand:** Feed the City by Tango Charities — `tangocharities.org`
- **Colors:** Orange `#FF6500`, Navy `#003366`, Sky Blue `#3BAEE8`
- **Fonts:** Anton (display/numbers), Open Sans (body)
- **Screenshot tool:** Playwright with Chrome — see `_screenshot.mjs` pattern from prior sessions

## Architecture Notes

- Three views: `view-main` → `view-log` → `view-impact`
- City picker uses a hidden `<select>` + custom searchable dropdown
- Canvas cards (`buildCanvas`, `buildImpactCanvas`) use 2× DPR for retina sharpness
- localStorage keys: `ftc_email`, `ftc_logs`
