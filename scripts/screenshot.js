const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 900, height: 700 });
  await page.goto('http://localhost:8080', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));

  // Main panel screenshot
  const appEl = await page.$('#app');
  await appEl.screenshot({ path: 'docs/img-main.png' });

  // Open apron settings
  await page.evaluate(() => {
    document.querySelector('.apron-toggle-btn').click();
  });
  await new Promise(r => setTimeout(r, 200));
  await appEl.screenshot({ path: 'docs/img-apron.png' });

  await browser.close();
  console.log('Screenshots saved.');
})();
