const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = '/Users/gerla/Documents/DLYRA/CLIENTES DLYRA/INGRID NUNEZ';

const carousels = [
  {
    html: 'C01-MAR14-PRESENTACION.html',
    prefix: 'C01',
    slides: 7,
    outDir: 'DIA_01_SAB_14_MAR',
  },
  {
    html: 'C08-MAR22-TEASER.html',
    prefix: 'C08',
    slides: 6,
    outDir: 'DIA_08_DOM_22_MAR',
  },
  {
    html: 'C10-MAR24-RECONOCES.html',
    prefix: 'C10',
    slides: 6,
    outDir: 'DIA_10_MAR_24_MAR',
  },
  {
    html: 'C11-MAR25-PREVIEW-MODULOS.html',
    prefix: 'C11',
    slides: 6,
    outDir: 'DIA_11_MIE_25_MAR',
  },
  {
    html: 'C12-MAR26-LANZAMIENTO.html',
    prefix: 'C12',
    slides: 7,
    outDir: 'DIA_12_JUE_26_MAR',
  },
  {
    html: 'C13-MAR27-POST-LANZAMIENTO.html',
    prefix: 'C13',
    slides: 6,
    outDir: 'DIA_13_VIE_27_MAR',
  },
];

(async () => {
  const browser = await chromium.launch();

  for (const c of carousels) {
    const htmlPath = path.join(BASE, 'CARRUSELES', c.html);
    const outFolder = path.join(BASE, 'PUBLICACIONES', c.outDir, 'CARRUSEL');

    fs.mkdirSync(outFolder, { recursive: true });

    console.log(`\n=== Exporting ${c.prefix} (${c.slides} slides) ===`);

    // Set viewport tall enough for all slides stacked vertically
    // Each slide is 1350px + 8px margin-bottom
    const totalHeight = c.slides * (1350 + 8) + 100;

    const page = await browser.newPage({
      viewport: { width: 1080, height: totalHeight },
    });

    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // Get bounding boxes of all slide elements
    const boxes = await page.evaluate(() => {
      const slides = document.querySelectorAll('body > div[class*="slide"]');
      return Array.from(slides).map(el => {
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
      });
    });

    console.log(`  Found ${boxes.length} slide elements (expected ${c.slides})`);

    const slideCount = Math.min(boxes.length, c.slides);

    for (let i = 0; i < slideCount; i++) {
      const slideNum = String(i + 1).padStart(2, '0');
      const outFile = path.join(outFolder, `${c.prefix}_slide_${slideNum}.png`);
      const box = boxes[i];

      await page.screenshot({
        path: outFile,
        fullPage: true,
        clip: {
          x: 0,
          y: Math.round(box.y),
          width: 1080,
          height: 1350,
        },
      });

      const stat = fs.statSync(outFile);
      console.log(`  ${c.prefix}_slide_${slideNum}.png  (${(stat.size / 1024).toFixed(0)} KB)`);
    }

    await page.close();
  }

  await browser.close();
  console.log('\n=== ALL DONE ===');
})();
