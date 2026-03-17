/**
 * export_stories_dias20_35.cjs
 * Exports story PNGs for DIA 20–35 (Ingrid Nunez) from two HTML source files.
 *
 * Source: HISTORIAS-BATCH3.html (DIA 20-25) + HISTORIAS-BATCH4.html (DIA 26-35)
 * Output dual:
 *   1) PUBLICACIONES/DIA_XX_.../HISTORIAS/H1.png, H2.png, H3.png
 *   2) HISTORIAS-PNG/{Dia}_{D}_{Mes}_H{N}.png  (e.g. Vie_3_Abr_H1.png)
 *
 * Usage: node export_stories_dias20_35.cjs
 */

'use strict';

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = path.resolve(__dirname);
const PUBLICACIONES = path.join(BASE, 'PUBLICACIONES');
const HISTORIAS_PNG = path.join(BASE, 'HISTORIAS-PNG');

// Each batch: HTML file + mapping of data-dia -> { folder, pngPrefix }
const BATCHES = [
  {
    htmlFile: path.join(BASE, 'HISTORIAS-BATCH3.html'),
    label: 'Batch 3 (DIA 20-25)',
    dias: {
      DIA_20: { folder: 'DIA_20_VIE_03_ABR', prefix: 'Vie_3_Abr' },
      DIA_21: { folder: 'DIA_21_SAB_04_ABR', prefix: 'Sab_4_Abr' },
      DIA_22: { folder: 'DIA_22_DOM_05_ABR', prefix: 'Dom_5_Abr' },
      DIA_23: { folder: 'DIA_23_LUN_06_ABR', prefix: 'Lun_6_Abr' },
      DIA_24: { folder: 'DIA_24_MAR_07_ABR', prefix: 'Mar_7_Abr' },
      DIA_25: { folder: 'DIA_25_MIE_08_ABR', prefix: 'Mie_8_Abr' },
    },
  },
  {
    htmlFile: path.join(BASE, 'HISTORIAS-BATCH4.html'),
    label: 'Batch 4 (DIA 26-35)',
    dias: {
      DIA_26: { folder: 'DIA_26_JUE_09_ABR', prefix: 'Jue_9_Abr' },
      DIA_27: { folder: 'DIA_27_VIE_10_ABR', prefix: 'Vie_10_Abr' },
      DIA_28: { folder: 'DIA_28_SAB_11_ABR', prefix: 'Sab_11_Abr' },
      DIA_29: { folder: 'DIA_29_DOM_12_ABR', prefix: 'Dom_12_Abr' },
      DIA_30: { folder: 'DIA_30_LUN_13_ABR', prefix: 'Lun_13_Abr' },
      DIA_31: { folder: 'DIA_31_MAR_14_ABR', prefix: 'Mar_14_Abr' },
      DIA_32: { folder: 'DIA_32_MIE_15_ABR', prefix: 'Mie_15_Abr' },
      DIA_33: { folder: 'DIA_33_JUE_16_ABR', prefix: 'Jue_16_Abr' },
      DIA_34: { folder: 'DIA_34_VIE_17_ABR', prefix: 'Vie_17_Abr' },
      DIA_35: { folder: 'DIA_35_SAB_18_ABR', prefix: 'Sab_18_Abr' },
    },
  },
];

async function exportBatch(browser, batch) {
  const { htmlFile, label, dias } = batch;

  console.log(`\n=== ${label} ===`);

  if (!fs.existsSync(htmlFile)) {
    console.error(`  ERROR: HTML not found: ${htmlFile}`);
    return 0;
  }

  // Gather all slides in this HTML (not just our target dias)
  // Need viewport tall enough for ALL slides in the file
  const page = await browser.newPage({
    viewport: { width: 1080, height: 1920 * 35 },
    deviceScaleFactor: 1,
  });

  const fileUrl = 'file://' + htmlFile;
  await page.goto(fileUrl, { waitUntil: 'networkidle' });

  // Wait for fonts and images
  await page.waitForTimeout(5000);

  // Gather all slides
  const slides = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.slide[data-dia]')).map(el => {
      const rect = el.getBoundingClientRect();
      return {
        dia: el.getAttribute('data-dia') || '',
        slot: el.getAttribute('data-slot') || '',
        x: Math.round(rect.left),
        y: Math.round(rect.top),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      };
    });
  });

  console.log(`  Found ${slides.length} total slides in HTML`);

  let exported = 0;

  for (const slide of slides) {
    const { dia, slot } = slide;
    const config = dias[dia];

    // Skip dias not in our target range
    if (!config) continue;

    if (!slot) {
      console.warn(`  SKIP: ${dia} missing data-slot`);
      continue;
    }

    // Validate size
    if (Math.abs(slide.width - 1080) > 5 || Math.abs(slide.height - 1920) > 5) {
      console.warn(`  WARN ${dia} ${slot}: size ${slide.width}x${slide.height} (expected 1080x1920)`);
    }

    const clip = {
      x: slide.x,
      y: slide.y,
      width: 1080,
      height: 1920,
    };

    try {
      // Output 1: PUBLICACIONES/DIA_XX_.../HISTORIAS/H1.png
      const pubDir = path.join(PUBLICACIONES, config.folder, 'HISTORIAS');
      fs.mkdirSync(pubDir, { recursive: true });
      const pubFile = path.join(pubDir, `${slot}.png`);
      await page.screenshot({ path: pubFile, clip });

      // Output 2: HISTORIAS-PNG/{prefix}_H1.png
      fs.mkdirSync(HISTORIAS_PNG, { recursive: true });
      const pngFile = path.join(HISTORIAS_PNG, `${config.prefix}_${slot}.png`);
      await page.screenshot({ path: pngFile, clip });

      exported++;
      console.log(`  OK  ${dia} ${slot} -> ${config.folder}/HISTORIAS/${slot}.png + ${config.prefix}_${slot}.png`);
    } catch (err) {
      console.error(`  FAIL ${dia} ${slot}: ${err.message} (y=${slide.y}, h=${slide.height})`);
    }
  }

  await page.close();
  return exported;
}

async function main() {
  console.log('=== Stories Export DIA 20-35 (Fixed) ===');
  console.log(`Output 1: PUBLICACIONES/DIA_XX/HISTORIAS/`);
  console.log(`Output 2: HISTORIAS-PNG/`);

  const browser = await chromium.launch({ headless: true });

  let totalExported = 0;

  for (const batch of BATCHES) {
    const count = await exportBatch(browser, batch);
    totalExported += count;
  }

  await browser.close();

  console.log('\n=== DONE ===');
  console.log(`Total: ${totalExported} story PNGs exported (${totalExported} to PUBLICACIONES + ${totalExported} to HISTORIAS-PNG)`);
  console.log(`Expected: 48 per destination (16 days x 3 stories)`);

  if (totalExported < 48) {
    console.warn(`WARNING: Expected 48 exports but got ${totalExported}. Check HTML for missing data-dia/data-slot attributes.`);
  }
}

main().catch(err => {
  console.error('\nFatal error:', err);
  process.exit(1);
});
