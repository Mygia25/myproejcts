/**
 * export_stories_batch2.cjs
 *
 * Exports all 21 story slides (Dias 10-16, 3 per day) from
 * HISTORIAS-DIAS-10-16.html to:
 *   PUBLICACIONES/DIA_XX_.../HISTORIAS/H1.png
 *   PUBLICACIONES/DIA_XX_.../HISTORIAS/H2.png
 *   PUBLICACIONES/DIA_XX_.../HISTORIAS/H3.png
 *
 * Usage: node export_stories_batch2.cjs
 */

'use strict';

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = '/Users/gerla/Documents/DLYRA/CLIENTES DLYRA/INGRID NUNEZ';
const HTML_FILE = path.join(BASE, 'HISTORIAS-DIAS-10-16.html');
const PUBLICACIONES = path.join(BASE, 'PUBLICACIONES');

// Map data-dia attribute → PUBLICACIONES subfolder name
const DIA_TO_FOLDER = {
  DIA_10: 'DIA_10_MAR_24_MAR',
  DIA_11: 'DIA_11_MIE_25_MAR',
  DIA_12: 'DIA_12_JUE_26_MAR',
  DIA_13: 'DIA_13_VIE_27_MAR',
  DIA_14: 'DIA_14_SAB_28_MAR',
  DIA_15: 'DIA_15_DOM_29_MAR',
  DIA_16: 'DIA_16_LUN_30_MAR',
};

async function main() {
  console.log('=== Ingrid Núñez · Story Export Batch 2 (Días 10–16) ===\n');

  if (!fs.existsSync(HTML_FILE)) {
    console.error('ERROR: HTML file not found:', HTML_FILE);
    process.exit(1);
  }

  const browser = await chromium.launch({
    headless: true,
    args: ['--allow-file-access-from-files', '--disable-web-security'],
  });

  // Large viewport: tall enough to render all 21 slides stacked
  const page = await browser.newPage({
    viewport: { width: 1080, height: 210000 },
    deviceScaleFactor: 1,
  });

  const fileUrl = 'file://' + HTML_FILE;
  await page.goto(fileUrl, { waitUntil: 'networkidle' });

  // Wait for Google Fonts to fully render
  await page.waitForTimeout(4000);

  // Collect slide metadata from the DOM
  const slides = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('div.slide'))
      .filter(el => {
        const r = el.getBoundingClientRect();
        return Math.abs(r.width - 1080) < 10 && Math.abs(r.height - 1920) < 10;
      })
      .map(el => {
        const r = el.getBoundingClientRect();
        return {
          dia:   el.getAttribute('data-dia')   || '',
          slot:  el.getAttribute('data-slot')  || '',
          fecha: el.getAttribute('data-fecha') || '',
          x: Math.round(r.x),
          y: Math.round(r.y),
        };
      });
  });

  console.log(`Found ${slides.length} story slides\n`);

  if (slides.length === 0) {
    console.error('No slides found — check that the HTML renders 1080×1920 divs.');
    await browser.close();
    process.exit(1);
  }

  let exported = 0;
  let skipped = 0;

  for (const slide of slides) {
    const folder = DIA_TO_FOLDER[slide.dia];
    if (!folder) {
      console.warn(`  SKIP: unknown dia="${slide.dia}" slot="${slide.slot}"`);
      skipped++;
      continue;
    }

    const outDir = path.join(PUBLICACIONES, folder, 'HISTORIAS');
    fs.mkdirSync(outDir, { recursive: true });

    const filename = slide.slot ? `${slide.slot}.png` : 'slide.png';
    const outPath = path.join(outDir, filename);

    await page.screenshot({
      path: outPath,
      clip: { x: slide.x, y: slide.y, width: 1080, height: 1920 },
      type: 'png',
    });

    console.log(`  OK  ${slide.dia} ${slide.slot} (${slide.fecha}) → ${folder}/HISTORIAS/${filename}`);
    exported++;
  }

  await browser.close();

  console.log(`\n═══════════════════════════════════`);
  console.log(`Total exported : ${exported}`);
  if (skipped > 0) console.log(`Skipped        : ${skipped}`);
  console.log(`Output folder  : ${PUBLICACIONES}`);
  console.log('Done.');
}

main().catch(err => {
  console.error('Fatal error:', err.message || err);
  process.exit(1);
});
