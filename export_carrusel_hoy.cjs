const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
  const htmlPath = path.resolve(__dirname, 'CARRUSELES/C01-MAR14-PRESENTACION.html');
  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  const outDir = path.resolve(__dirname, 'CARRUSELES-PNG');
  fs.mkdirSync(outDir, { recursive: true });

  // Select all slide types
  const slides = await page.$$('.slide, .slide-inner, .slide-cta');
  for (let i = 0; i < slides.length; i++) {
    const num = String(i + 1).padStart(2, '0');
    const outPath = path.join(outDir, 'C01_slide_' + num + '.png');
    await slides[i].screenshot({ path: outPath });
    console.log('OK: ' + outPath);
  }
  await browser.close();
  console.log('Done! ' + slides.length + ' slides exported.');
})();
