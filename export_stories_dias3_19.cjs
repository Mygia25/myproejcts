/**
 * export_stories_dias3_19.cjs
 *
 * Unified export script for ALL Instagram Stories, Days 3–19.
 * Exports to BOTH:
 *   1. PUBLICACIONES/DIA_XX_.../HISTORIAS/H1.png, H2.png, H3.png
 *   2. HISTORIAS-PNG/{DayName}_{Day}_{Month}_H{N}.png
 *
 * Sources:
 *   - HISTORIAS-DIA_03.html through HISTORIAS-DIA_09.html (individual files, 3 slides each)
 *   - HISTORIAS-DIAS-10-16.html (batch file with data-dia/data-slot attributes)
 *   - HISTORIAS-BATCH3.html (batch file with data-dia/data-slot attributes, days 17–19 extracted)
 *
 * Usage: node export_stories_dias3_19.cjs
 * Requires: playwright
 */

'use strict';

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname);
const PUBLICACIONES = path.join(ROOT, 'PUBLICACIONES');
const HISTORIAS_PNG = path.join(ROOT, 'HISTORIAS-PNG');

// ── Calendar mapping ──
const DAY_MAP = {
  DIA_03: { folder: 'DIA_03_MAR_17_MAR', prefix: 'Mar_17_Mar' },
  DIA_04: { folder: 'DIA_04_MIE_18_MAR', prefix: 'Mie_18_Mar' },
  DIA_05: { folder: 'DIA_05_JUE_19_MAR', prefix: 'Jue_19_Mar' },
  DIA_06: { folder: 'DIA_06_VIE_20_MAR', prefix: 'Vie_20_Mar' },
  DIA_07: { folder: 'DIA_07_SAB_21_MAR', prefix: 'Sab_21_Mar' },
  DIA_08: { folder: 'DIA_08_DOM_22_MAR', prefix: 'Dom_22_Mar' },
  DIA_09: { folder: 'DIA_09_LUN_23_MAR', prefix: 'Lun_23_Mar' },
  DIA_10: { folder: 'DIA_10_MAR_24_MAR', prefix: 'Mar_24_Mar' },
  DIA_11: { folder: 'DIA_11_MIE_25_MAR', prefix: 'Mie_25_Mar' },
  DIA_12: { folder: 'DIA_12_JUE_26_MAR', prefix: 'Jue_26_Mar' },
  DIA_13: { folder: 'DIA_13_VIE_27_MAR', prefix: 'Vie_27_Mar' },
  DIA_14: { folder: 'DIA_14_SAB_28_MAR', prefix: 'Sab_28_Mar' },
  DIA_15: { folder: 'DIA_15_DOM_29_MAR', prefix: 'Dom_29_Mar' },
  DIA_16: { folder: 'DIA_16_LUN_30_MAR', prefix: 'Lun_30_Mar' },
  DIA_17: { folder: 'DIA_17_MAR_31_MAR', prefix: 'Mar_31_Mar' },
  DIA_18: { folder: 'DIA_18_MIE_01_ABR', prefix: 'Mie_1_Abr' },
  DIA_19: { folder: 'DIA_19_JUE_02_ABR', prefix: 'Jue_2_Abr' },
};

const SLOT_NAMES = ['H1', 'H2', 'H3'];
const FONT_WAIT_MS = 4000;

// ── Individual HTML files (days 3–9) — no data attributes, just 3 sequential .slide divs ──
const INDIVIDUAL_FILES = [
  { html: 'HISTORIAS-DIA_03.html', dia: 'DIA_03' },
  { html: 'HISTORIAS-DIA_04.html', dia: 'DIA_04' },
  { html: 'HISTORIAS-DIA_05.html', dia: 'DIA_05' },
  { html: 'HISTORIAS-DIA_06.html', dia: 'DIA_06' },
  { html: 'HISTORIAS-DIA_07.html', dia: 'DIA_07' },
  { html: 'HISTORIAS-DIA_08.html', dia: 'DIA_08' },
  { html: 'HISTORIAS-DIA_09.html', dia: 'DIA_09' },
];

// ── Batch HTML files (days 10–16 and 17–19) — slides have data-dia + data-slot attributes ──
const BATCH_FILES = [
  { html: 'HISTORIAS-DIAS-10-16.html', dias: ['DIA_10','DIA_11','DIA_12','DIA_13','DIA_14','DIA_15','DIA_16'] },
  { html: 'HISTORIAS-BATCH3.html',     dias: ['DIA_17','DIA_18','DIA_19'] },
];

function savePng(diaKey, slotName, buffer) {
  const map = DAY_MAP[diaKey];
  if (!map) return false;

  // 1. PUBLICACIONES path
  const pubDir = path.join(PUBLICACIONES, map.folder, 'HISTORIAS');
  fs.mkdirSync(pubDir, { recursive: true });
  fs.writeFileSync(path.join(pubDir, slotName + '.png'), buffer);

  // 2. HISTORIAS-PNG path
  fs.mkdirSync(HISTORIAS_PNG, { recursive: true });
  const flatName = `${map.prefix}_${slotName}.png`;
  fs.writeFileSync(path.join(HISTORIAS_PNG, flatName), buffer);

  return true;
}

async function exportIndividualFile(browser, entry) {
  const htmlPath = path.join(ROOT, entry.html);
  if (!fs.existsSync(htmlPath)) {
    console.error(`  MISSING: ${entry.html}`);
    return { ok: 0, fail: 1 };
  }

  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle' });
  await page.waitForTimeout(FONT_WAIT_MS);

  const slides = await page.$$('.slide');
  let ok = 0, fail = 0;

  for (let i = 0; i < Math.min(slides.length, 3); i++) {
    try {
      const buffer = await slides[i].screenshot({ type: 'png' });
      const saved = savePng(entry.dia, SLOT_NAMES[i], buffer);
      if (saved) {
        console.log(`  OK  ${entry.dia} ${SLOT_NAMES[i]}`);
        ok++;
      } else {
        console.warn(`  SKIP ${entry.dia} ${SLOT_NAMES[i]} (no mapping)`);
        fail++;
      }
    } catch (err) {
      console.error(`  FAIL ${entry.dia} ${SLOT_NAMES[i]}: ${err.message}`);
      fail++;
    }
  }

  await page.close();
  return { ok, fail };
}

async function exportBatchFile(browser, entry) {
  const htmlPath = path.join(ROOT, entry.html);
  if (!fs.existsSync(htmlPath)) {
    console.error(`  MISSING: ${entry.html}`);
    return { ok: 0, fail: 1 };
  }

  // Calculate total slides expected
  const totalSlides = entry.dias.length * 3;
  const pageHeight = 1920 * totalSlides + 500;

  const page = await browser.newPage({
    viewport: { width: 1080, height: pageHeight },
    deviceScaleFactor: 1,
  });

  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle' });
  await page.waitForTimeout(FONT_WAIT_MS);

  // Get all slides with data-dia attribute, filtered to only the dias we want
  const allowedDias = new Set(entry.dias);
  const slides = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.slide[data-dia]')).map(el => {
      const rect = el.getBoundingClientRect();
      return {
        dia: el.getAttribute('data-dia'),
        slot: el.getAttribute('data-slot'),
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      };
    });
  });

  let ok = 0, fail = 0;

  for (const slide of slides) {
    if (!allowedDias.has(slide.dia)) continue;
    if (!slide.slot) continue;

    try {
      const buffer = await page.screenshot({
        clip: { x: slide.x, y: slide.y, width: 1080, height: 1920 },
        type: 'png',
      });
      const saved = savePng(slide.dia, slide.slot, buffer);
      if (saved) {
        console.log(`  OK  ${slide.dia} ${slide.slot}`);
        ok++;
      } else {
        console.warn(`  SKIP ${slide.dia} ${slide.slot} (no mapping)`);
        fail++;
      }
    } catch (err) {
      console.error(`  FAIL ${slide.dia} ${slide.slot}: ${err.message}`);
      fail++;
    }
  }

  await page.close();
  return { ok, fail };
}

(async () => {
  console.log('================================================================');
  console.log('  Ingrid Nunez Stories Export — Days 3 through 19');
  console.log('  Output: PUBLICACIONES/*/HISTORIAS/ + HISTORIAS-PNG/');
  console.log('================================================================\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--allow-file-access-from-files', '--disable-web-security'],
  });

  let totalOk = 0, totalFail = 0;

  // ── Phase 1: Individual HTML files (Days 3–9) ──
  console.log('--- PHASE 1: Individual files (Days 3-9) ---');
  for (const entry of INDIVIDUAL_FILES) {
    const result = await exportIndividualFile(browser, entry);
    totalOk += result.ok;
    totalFail += result.fail;
  }

  // ── Phase 2: Batch file for Days 10–16 ──
  console.log('\n--- PHASE 2: Batch file (Days 10-16) ---');
  const batch2 = BATCH_FILES[0];
  const result2 = await exportBatchFile(browser, batch2);
  totalOk += result2.ok;
  totalFail += result2.fail;

  // ── Phase 3: Batch file for Days 17–19 (from BATCH3 which has days 17-25) ──
  console.log('\n--- PHASE 3: Batch file (Days 17-19 from BATCH3) ---');
  const batch3 = BATCH_FILES[1];
  const result3 = await exportBatchFile(browser, batch3);
  totalOk += result3.ok;
  totalFail += result3.fail;

  await browser.close();

  console.log('\n================================================================');
  console.log(`  TOTAL: ${totalOk} exported, ${totalFail} errors/skips`);
  console.log(`  Expected: ${Object.keys(DAY_MAP).length * 3} = ${Object.keys(DAY_MAP).length} days x 3 stories`);
  console.log('================================================================');

  if (totalFail > 0) process.exit(1);
})();
