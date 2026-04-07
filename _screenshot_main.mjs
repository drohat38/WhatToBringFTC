import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
await page.screenshot({ path: '_main_above_fold.png', fullPage: false });
await page.screenshot({ path: '_main_full.png', fullPage: true });
console.log('Done.');
await browser.close();
