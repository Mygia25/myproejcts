// export_stories_batch3.cjs
// Exports 27 story slides (Days 17-25 x 3 stories each) to PNG.
// Output: PUBLICACIONES/DIA_XX_.../HISTORIAS/H1.png, H2.png, H3.png
// Usage: node export_stories_batch3.cjs

'use strict';

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname);
const HTML_FILE = path.join(ROOT, 'HISTORIAS-BATCH3.html');
const PUBLICACIONES = path.join(ROOT, 'PUBLICACIONES');

// Map each dia to its folder name (must match existing PUBLICACIONES dirs)
const DIA_FOLDERS = {
  DIA_17: 'DIA_17_MAR_31_MAR',
  DIA_18: 'DIA_18_MIE_01_ABR',
  DIA_19: 'DIA_19_JUE_02_ABR',
  DIA_20: 'DIA_20_VIE_03_ABR',
  DIA_21: 'DIA_21_SAB_04_ABR',
  DIA_22: 'DIA_22_DOM_05_ABR',
  DIA_23: 'DIA_23_LUN_06_ABR',
  DIA_24: 'DIA_24_MAR_07_ABR',
  DIA_25: 'DIA_25_MIE_08_ABR',
};

(async () => {
  // Verify HTML source exists
  if (!fs.existsSync(HTML_FILE)) {
    console.error('ERROR: HISTORIAS-BATCH3.html not found at', HTML_FILE);
    process.exit(1);
  }

  const browser = await chromium.launch();

  // Viewport must be exactly 1080 wide; height large enough for all slides stacked
  const page = await browser.newPage({
    viewport: { width: 1080, height: 1920 * 27 + 200 }
  });

  const fileUrl = 'file://' + HTML_FILE;
  await page.goto(fileUrl, { waitUntil: 'networkidle' });

  // Wait for Google Fonts to load
  await page.waitForTimeout(4000);

  // Gather all slide elements with their dia and slot attributes
  const slides = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.slide[data-dia]')).map(el => {
      const rect = el.getBoundingClientRect();
      return {
        dia: el.getAttribute('data-dia'),
        slot: el.getAttribute('data-slot'),
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
      };
    });
  });

  console.log(`Found ${slides.length} slides to export.\n`);

  let success = 0;
  let errors = 0;

  for (const slide of slides) {
    const folderName = DIA_FOLDERS[slide.dia];
    if (!folderName) {
      console.warn(`  WARN: No folder mapping for ${slide.dia}`);
      errors++;
      continue;
    }

    const outDir = path.join(PUBLICACIONES, folderName, 'HISTORIAS');
    fs.mkdirSync(outDir, { recursive: true });

    const outFile = path.join(outDir, `${slide.slot}.png`);

    try {
      await page.screenshot({
        path: outFile,
        clip: {
          x: Math.round(slide.x),
          y: Math.round(slide.y),
          width: 1080,
          height: 1920,
        },
      });

      console.log(`  OK  ${slide.dia} ${slide.slot}  →  ${path.relative(ROOT, outFile)}`);
      success++;
    } catch (err) {
      console.error(`  FAIL ${slide.dia} ${slide.slot}: ${err.message}`);
      errors++;
    }
  }

  await browser.close();

  console.log(`\n────────────────────────────────────`);
  console.log(`Done.  ${success} exported,  ${errors} errors.`);
  console.log(`Output: PUBLICACIONES/DIA_1X–DIA_25/HISTORIAS/`);
})();
