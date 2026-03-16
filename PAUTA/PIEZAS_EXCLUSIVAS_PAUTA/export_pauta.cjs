/**
 * export_pauta.cjs — Export all Ingrid Núñez ad pieces to PNG
 *
 * Handles three formats:
 *   - 1080x1350  → carousels (PIEZA_02, PIEZA_06)
 *   - 1080x1080  → square feed (PIEZA_03)
 *   - 1080x1920  → vertical story/reel (PIEZA_04, PIEZA_05)
 *
 * Each piece exports one PNG per slide found in the HTML.
 * Output: PNGs alongside each HTML file in this same directory.
 *
 * Usage:
 *   cd "/Users/gerla/Documents/DLYRA/CLIENTES DLYRA/INGRID NUNEZ"
 *   node PAUTA/PIEZAS_EXCLUSIVAS_PAUTA/export_pauta.cjs
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = '/Users/gerla/Documents/DLYRA/CLIENTES DLYRA/INGRID NUNEZ/PAUTA/PIEZAS_EXCLUSIVAS_PAUTA';

const PIECES = [
  {
    file: 'PIEZA_02_ANTES_DESPUES.html',
    prefix: 'PIEZA_02',
    viewport: { width: 1080, height: 1350 },
    slideHeight: 1350,
  },
  {
    file: 'PIEZA_03_SOCIAL_PROOF.html',
    prefix: 'PIEZA_03',
    viewport: { width: 1080, height: 1080 },
    slideHeight: 1080,
  },
  {
    file: 'PIEZA_04_3_ERRORES.html',
    prefix: 'PIEZA_04',
    viewport: { width: 1080, height: 1920 },
    slideHeight: 1920,
  },
  {
    file: 'PIEZA_05_STORY_ENCUESTA.html',
    prefix: 'PIEZA_05',
    viewport: { width: 1080, height: 1920 },
    slideHeight: 1920,
  },
  {
    file: 'PIEZA_06_FAQ_CAROUSEL.html',
    prefix: 'PIEZA_06',
    viewport: { width: 1080, height: 1350 },
    slideHeight: 1350,
  },
];

async function exportPiece(browser, entry) {
  const htmlPath = path.join(BASE, entry.file);

  if (!fs.existsSync(htmlPath)) {
    console.error(`  SKIP ${entry.prefix}: HTML not found at ${htmlPath}`);
    return 0;
  }

  const page = await browser.newPage({
    viewport: { width: entry.viewport.width, height: entry.viewport.height },
    deviceScaleFactor: 1,
  });

  const fileUrl = 'file://' + htmlPath;
  await page.goto(fileUrl, { waitUntil: 'networkidle', timeout: 30000 });

  // Wait for Google Fonts to load (give them up to 4s)
  await page.waitForTimeout(4000);

  // Find all .slide elements
  const slideCount = await page.evaluate(() => {
    return document.querySelectorAll('.slide').length;
  });

  let exported = 0;

  if (slideCount === 0) {
    // Single-slide piece: screenshot the body directly
    const padNum = String(exported + 1).padStart(2, '0');
    const outPath = path.join(BASE, `${entry.prefix}_slide_${padNum}.png`);
    await page.screenshot({ path: outPath, type: 'png', clip: { x: 0, y: 0, width: entry.viewport.width, height: entry.viewport.height } });
    exported = 1;
    console.log(`    slide ${padNum} -> ${path.basename(outPath)}`);
  } else {
    for (let i = 0; i < slideCount; i++) {
      const el = await page.$(`.slide:nth-child(${i + 1})`);
      if (el) {
        exported++;
        const padNum = String(exported).padStart(2, '0');
        const outPath = path.join(BASE, `${entry.prefix}_slide_${padNum}.png`);
        await el.screenshot({ path: outPath, type: 'png' });
        console.log(`    slide ${padNum} -> ${path.basename(outPath)}`);
      }
    }
  }

  await page.close();
  return exported;
}

async function main() {
  console.log('');
  console.log('=== Ingrid Núñez — Ad Pieces PNG Export ===');
  console.log(`Source dir: ${BASE}`);
  console.log('');

  const browser = await chromium.launch({ headless: true });

  let totalSlides = 0;
  const results = {};

  for (const entry of PIECES) {
    console.log(`Exporting ${entry.prefix} (${entry.file})...`);
    try {
      const count = await exportPiece(browser, entry);
      results[entry.prefix] = count;
      totalSlides += count;
      console.log(`  -> ${count} slide(s) exported`);
    } catch (err) {
      console.error(`  ERROR: ${err.message}`);
      results[entry.prefix] = 0;
    }
    console.log('');
  }

  await browser.close();

  console.log('=== SUMMARY ===');
  for (const [prefix, count] of Object.entries(results)) {
    const status = count > 0 ? `${count} slide(s)` : 'FAILED';
    console.log(`  ${prefix}: ${status}`);
  }
  console.log(`\nTotal: ${totalSlides} PNG(s) exported`);
  console.log(`Output: ${BASE}`);
  console.log('');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
