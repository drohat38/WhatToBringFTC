import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

// ── Main view ──
await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
await page.screenshot({ path: '_check_main.png', fullPage: false });
console.log('Main view saved.');

// ── Impact view (with data) ──
await page.evaluate(() => {
  localStorage.setItem('ftc_email', 'demo@example.com');
  localStorage.setItem('ftc_logs', JSON.stringify([
    { meals: 30, date: '1/1/2025', chapter: 'Dallas, TX' },
    { meals: 50, date: '2/1/2025', chapter: 'Dallas, TX' },
  ]));
});
await page.reload({ waitUntil: 'networkidle' });
await page.evaluate(() => showImpact(false));
await page.waitForTimeout(1000);
await page.screenshot({ path: '_check_impact_fold.png', fullPage: false });
await page.screenshot({ path: '_check_impact_full.png', fullPage: true });
console.log('Impact view saved.');

await browser.close();
