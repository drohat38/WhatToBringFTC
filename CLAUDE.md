# FTC Planner — Claude Instructions

## Plugin & Tool Permissions

You are **pre-authorized** to use any available plugins, MCP tools, or browser automation tools (including Playwright, `browser_subagent`, magic component builder, etc.) without waiting for explicit per-task permission from the user. Use whatever tools help you produce the best result.

## Frontend Visual Rules: The Screenshot Loop

**MANDATORY:** Whenever you are asked to modify HTML/CSS, Canvas styling, or any UI elements, you MUST follow this loop before finalizing code:

### Step-by-step procedure

1. **Start a local preview server:**
   ```bash
   npx serve . --listen 3000
   ```
   (Run in the background so the port stays open during iteration.)

2. **Open the page in a headless browser via Playwright:**
   Use the `_screenshot.mjs` pattern with Chrome at `C:/Program Files/Google/Chrome/Application/chrome.exe`:
   ```js
   // _screenshot.mjs
   import { chromium } from 'playwright';
   const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
   const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
   await page.goto('http://localhost:3000/index.html');
   await page.screenshot({ path: '_shot.png', fullPage: false });
   await browser.close();
   ```
   Run with: `node _screenshot.mjs`

3. **Read the screenshot with your vision tools** (`Read` the `.png` file path).

4. **Analyze against these quality standards:**
   - **Alignment:** All elements properly aligned; no orphaned or floating items.
   - **Spacing:** Generous, consistent whitespace; no cramped sections.
   - **Typography:** Clear hierarchy — numbers > labels, headings > body.
   - **Color:** Brand palette in use — Orange `#FF6500`, Navy `#003366`, Sky Blue `#3BAEE8`, White `#FFFFFF`.
   - **Premium feel:** Looks like a modern SaaS product (Strava / Duolingo / Notion quality).

5. **Iterate** on the CSS/HTML based on what you see. Repeat from step 2 until the result looks excellent.

**NEVER finalize any visual change without at least one screenshot review.**  
**NEVER code UI blindly.**

---

## Project Context

- **Stack:** Vanilla HTML/CSS/JS — no framework, no build step
- **Files:** `index.html`, `style.css`, `script.js`, `ftc_v3.html` (synced copy)
- **Brand:** Feed the City by Tango Charities — `tangocharities.org`
- **Colors:** Orange `#FF6500`, Navy `#003366`, Sky Blue `#3BAEE8`
- **Fonts:** Anton (display/numbers), Open Sans (body)
- **Screenshot tool:** Playwright with Chrome — see `_screenshot.mjs` pattern above

## Architecture Notes

- Three views: `view-main` → `view-log` → `view-impact`
- City picker uses a hidden `<select>` + custom searchable dropdown
- Canvas cards (`buildCanvas`, `buildImpactCanvas`) use 2× DPR for retina sharpness
- localStorage keys: `ftc_email`, `ftc_logs`
- Milestones section (`.ms-list`) uses a vertical timeline layout; all 4 milestone rows are always shown; the `.active` class marks the next target milestone; `.reached` marks completed ones.
