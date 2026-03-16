/**
 * export_stories_batch1.cjs
 * Exports Instagram Stories (H1, H2, H3) for DIA_03 through DIA_09
 * Ingrid Núñez — D'Lyra Studio
 *
 * Usage: node export_stories_batch1.cjs
 * Requires: playwright (already in package.json)
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = path.resolve(__dirname);

const DAYS = [
  {
    html: 'HISTORIAS-DIA_03.html',
    outDir: 'PUBLICACIONES/DIA_03_MAR_17_MAR/HISTORIAS',
    label: 'DIA_03 · Mar 17 Mar · Rabietas',
  },
  {
    html: 'HISTORIAS-DIA_04.html',
    outDir: 'PUBLICACIONES/DIA_04_MIE_18_MAR/HISTORIAS',
    label: 'DIA_04 · Mié 18 Mar · Pantallas',
  },
  {
    html: 'HISTORIAS-DIA_05.html',
    outDir: 'PUBLICACIONES/DIA_05_JUE_19_MAR/HISTORIAS',
    label: 'DIA_05 · Jue 19 Mar · Felicidad',
  },
  {
    html: 'HISTORIAS-DIA_06.html',
    outDir: 'PUBLICACIONES/DIA_06_VIE_20_MAR/HISTORIAS',
    label: 'DIA_06 · Vie 20 Mar · Síndrome de Down',
  },
  {
    html: 'HISTORIAS-DIA_07.html',
    outDir: 'PUBLICACIONES/DIA_07_SAB_21_MAR/HISTORIAS',
    label: 'DIA_07 · Sáb 21 Mar · Papá agotado',
  },
  {
    html: 'HISTORIAS-DIA_08.html',
    outDir: 'PUBLICACIONES/DIA_08_DOM_22_MAR/HISTORIAS',
    label: 'DIA_08 · Dom 22 Mar · Teaser curso',
  },
  {
    html: 'HISTORIAS-DIA_09.html',
    outDir: 'PUBLICACIONES/DIA_09_LUN_23_MAR/HISTORIAS',
    label: 'DIA_09 · Lun 23 Mar · Termostato emocional',
  },
];

const STORY_NAMES = ['H1', 'H2', 'H3'];
const WAIT_MS = 3000; // wait for Google Fonts to load

(async () => {
  console.log('=== export_stories_batch1 — Ingrid Núñez ===');
  console.log(`Processing ${DAYS.length} days × 3 stories = ${DAYS.length * 3} PNGs\n`);

  const browser = await chromium.launch();
  let totalOk = 0;
  let totalErrors = 0;

  for (const day of DAYS) {
    console.log(`--- ${day.label} ---`);

    const htmlPath = path.join(BASE, day.html);
    const outDir = path.join(BASE, day.outDir);

    // Verify source HTML exists
    if (!fs.existsSync(htmlPath)) {
      console.error(`  ERROR: HTML not found at ${htmlPath}`);
      totalErrors++;
      continue;
    }

    // Ensure output directory exists
    fs.mkdirSync(outDir, { recursive: true });

    const page = await browser.newPage({
      viewport: { width: 1080, height: 1920 },
    });

    try {
      await page.goto('file://' + htmlPath, { waitUntil: 'networkidle' });
      // Extra wait for Google Fonts to fully render
      await page.waitForTimeout(WAIT_MS);

      const slides = await page.$$('.slide');

      if (slides.length !== 3) {
        console.warn(`  WARN: Expected 3 slides, found ${slides.length}`);
      }

      for (let i = 0; i < Math.min(slides.length, 3); i++) {
        const outPath = path.join(outDir, STORY_NAMES[i] + '.png');
        await slides[i].screenshot({ path: outPath });
        console.log(`  OK: ${STORY_NAMES[i]} → ${outPath}`);
        totalOk++;
      }
    } catch (err) {
      console.error(`  ERROR exporting ${day.label}: ${err.message}`);
      totalErrors++;
    } finally {
      await page.close();
    }
  }

  await browser.close();

  console.log('\n=== DONE ===');
  console.log(`  Exported: ${totalOk} PNGs`);
  if (totalErrors > 0) {
    console.log(`  Errors:   ${totalErrors}`);
    process.exit(1);
  } else {
    console.log('  All stories exported successfully.');
  }
})();
