/**
 * export_stories_batch4.cjs
 * Export 30 Instagram story PNGs for DIA 26-35 (Ingrid Núñez)
 *
 * Source: HISTORIAS-BATCH4.html (1080x1920 slides)
 * Output: PUBLICACIONES/DIA_XX_[N]/HISTORIAS/H1.png, H2.png, H3.png
 *
 * Usage: node export_stories_batch4.cjs
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = '/Users/gerla/Documents/DLYRA/CLIENTES DLYRA/INGRID NUNEZ';
const HTML_FILE = path.join(BASE, 'HISTORIAS-BATCH4.html');
const PUBLICACIONES = path.join(BASE, 'PUBLICACIONES');

// Mapping: data-dia -> output folder name
const DIA_TO_FOLDER = {
  DIA_26: 'DIA_26_JUE_09_ABR',
  DIA_27: 'DIA_27_VIE_10_ABR',
  DIA_28: 'DIA_28_SAB_11_ABR',
  DIA_29: 'DIA_29_DOM_12_ABR',
  DIA_30: 'DIA_30_LUN_13_ABR',
  DIA_31: 'DIA_31_MAR_14_ABR',
  DIA_32: 'DIA_32_MIE_15_ABR',
  DIA_33: 'DIA_33_JUE_16_ABR',
  DIA_34: 'DIA_34_VIE_17_ABR',
  DIA_35: 'DIA_35_SAB_18_ABR',
};

async function main() {
  console.log('=== Stories Batch 4 Export (DIA 26–35) ===\n');

  if (!fs.existsSync(HTML_FILE)) {
    console.error('ERROR: HTML source not found:', HTML_FILE);
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });

  // Open page with tall viewport to render all 30 slides at once
  const page = await browser.newPage({
    viewport: { width: 1080, height: 60000 },
    deviceScaleFactor: 1,
  });

  const fileUrl = 'file://' + HTML_FILE;
  await page.goto(fileUrl, { waitUntil: 'networkidle' });

  // Wait for Google Fonts and images to load
  await page.waitForTimeout(4000);

  // Gather all slide positions and metadata
  const slides = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.slide')).map(el => {
      const rect = el.getBoundingClientRect();
      return {
        dia:  el.getAttribute('data-dia')  || '',
        slot: el.getAttribute('data-slot') || '',
        x: Math.round(rect.left),
        y: Math.round(rect.top),
        width:  Math.round(rect.width),
        height: Math.round(rect.height),
      };
    });
  });

  console.log(`Found ${slides.length} slides\n`);

  let totalExported = 0;
  const summary = {};

  for (const slide of slides) {
    const { dia, slot, x, y, width, height } = slide;

    if (!dia || !slot) {
      console.warn(`  SKIP: slide missing data-dia or data-slot`);
      continue;
    }

    const folderName = DIA_TO_FOLDER[dia];
    if (!folderName) {
      console.warn(`  SKIP: no folder mapping for ${dia}`);
      continue;
    }

    // Validate dimensions (allow ±5px tolerance)
    if (Math.abs(width - 1080) > 5 || Math.abs(height - 1920) > 5) {
      console.warn(`  WARN ${dia} ${slot}: unexpected size ${width}x${height}`);
    }

    const outDir = path.join(PUBLICACIONES, folderName, 'HISTORIAS');
    fs.mkdirSync(outDir, { recursive: true });

    const outFile = path.join(outDir, `${slot}.png`);

    await page.screenshot({
      path: outFile,
      clip: { x, y, width: 1080, height: 1920 },
    });

    totalExported++;
    summary[dia] = (summary[dia] || 0) + 1;
    console.log(`  OK  ${dia} ${slot} -> ${folderName}/HISTORIAS/${slot}.png`);
  }

  await browser.close();

  console.log('\n=== SUMMARY ===');
  for (const [dia, count] of Object.entries(summary)) {
    const folder = DIA_TO_FOLDER[dia] || '???';
    console.log(`  ${dia} (${folder}): ${count} stories`);
  }
  console.log(`\nTotal: ${totalExported} story PNGs exported`);
}

main().catch(err => {
  console.error('\nFatal error:', err);
  process.exit(1);
});
