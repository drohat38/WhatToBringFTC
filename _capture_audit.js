/**
 * FTC Planner — Visual Audit Screenshot Script
 * Run: node _capture_audit.js
 * Outputs to: .temp_snapshots/
 */
const { chromium } = require('playwright');
const path = require('path');

const OUT = path.join(__dirname, '.temp_snapshots');
const BASE = 'http://localhost:5173';
const VIEWPORT = { width: 390, height: 844 };

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
  });

  const page = await browser.newPage({ viewport: VIEWPORT });

  // ── 1. Initial calculator state (goal = 30) ──────────────────────────────
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT, '1-calculator.png'), fullPage: true });
  console.log('✓ 1-calculator.png');

  // ── 2. Receipt + Email Capture ───────────────────────────────────────────
  // Click the primary CTA to trigger the flow transition
  await page.click('button.cta-primary');
  await page.waitForTimeout(1200); // wait for Framer Motion morph + slide-in
  await page.screenshot({ path: path.join(OUT, '2-receipt-and-email.png'), fullPage: true });
  console.log('✓ 2-receipt-and-email.png');

  // ── 3. Success / Eventbrite Reveal ──────────────────────────────────────
  // Fill email
  await page.fill('input[type="email"]', 'volunteer@example.com');
  // Select a city (first real option in the select)
  await page.selectOption('select.ec-select', 'denton-tx');
  // Submit
  await page.click('button.ec-submit');
  await page.waitForTimeout(1800); // wait for SVG ring + checkmark animation
  await page.screenshot({ path: path.join(OUT, '3-success-state.png'), fullPage: true });
  console.log('✓ 3-success-state.png');

  await browser.close();
  console.log('\nAll snapshots saved to .temp_snapshots/');
})();
