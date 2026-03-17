/**
 * fix_images_export.cjs — Re-export ONLY the carousels whose images were fixed
 *
 * Modified carousels: C05, C06, C07, C09, C14, C15, C16, C17, C18, C19, C20
 *
 * For each carousel, opens the HTML in Playwright, finds all slide elements
 * (direct children of body that are ~1080x1350), and screenshots each to the
 * corresponding PUBLICACIONES/DIA_##/CARRUSEL/ folder.
 *
 * Usage: node fix_images_export.cjs
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = '/Users/gerla/Documents/DLYRA/CLIENTES DLYRA/INGRID NUNEZ';
const CARRUSELES = path.join(BASE, 'CARRUSELES');
const PUBLICACIONES = path.join(BASE, 'PUBLICACIONES');

// Only the carousels that were modified in the image fix
const MAPPING = [
  { file: 'C05-MAR18-FELICIDAD.html',           dir: 'DIA_05_JUE_19_MAR', prefix: 'C05' },
  { file: 'C06-MAR19-SINDROME-DOWN.html',       dir: 'DIA_06_VIE_20_MAR', prefix: 'C06' },
  { file: 'C07-MAR20-PAPA-AGOTADO.html',        dir: 'DIA_07_SAB_21_MAR', prefix: 'C07' },
  { file: 'C09-MAR23-TERMOSTATO.html',          dir: 'DIA_09_LUN_23_MAR', prefix: 'C09' },
  { file: 'C14-MAR30-ETAPAS.html',              dir: 'DIA_14_SAB_28_MAR', prefix: 'C14' },
  { file: 'C15-ABR01-AUTISMO.html',             dir: 'DIA_17_MAR_31_MAR', prefix: 'C15' },
  { file: 'C16-ABR03-SEMANA-SANTA.html',        dir: 'DIA_19_JUE_02_ABR', prefix: 'C16' },
  { file: 'C17-ABR06-SALUD.html',               dir: 'DIA_23_LUN_06_ABR', prefix: 'C17' },
  { file: 'C18-ABR08-LIMITES.html',             dir: 'DIA_25_MIE_08_ABR', prefix: 'C18' },
  { file: 'C19-ABR14-HERIDAS.html',             dir: 'DIA_31_MAR_14_ABR', prefix: 'C19' },
  { file: 'C20-ABR16-PRESENCIA.html',           dir: 'DIA_32_MIE_15_ABR', prefix: 'C20' },
];

async function exportCarousel(browser, entry) {
  const htmlPath = path.join(CARRUSELES, entry.file);
  const outDir = path.join(PUBLICACIONES, entry.dir, 'CARRUSEL');

  if (!fs.existsSync(htmlPath)) {
    console.error(`  SKIP ${entry.prefix}: HTML not found at ${htmlPath}`);
    return 0;
  }

  fs.mkdirSync(outDir, { recursive: true });

  const page = await browser.newPage({
    viewport: { width: 1080, height: 1350 },
    deviceScaleFactor: 1,
  });

  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // Find all slide elements: direct children of body that are ~1080x1350
  const slideIndices = await page.evaluate(() => {
    const children = Array.from(document.body.children);
    const results = [];
    for (let i = 0; i < children.length; i++) {
      const rect = children[i].getBoundingClientRect();
      if (Math.abs(rect.width - 1080) <= 5 && Math.abs(rect.height - 1350) <= 5) {
        results.push(i);
      }
    }
    return results;
  });

  if (slideIndices.length === 0) {
    console.error(`  WARN ${entry.prefix}: No 1080x1350 slides found! Trying [class*="slide"]...`);
    const fallbackSlides = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('[class*="slide"]'));
      const seen = new Set();
      const results = [];
      for (const el of els) {
        const rect = el.getBoundingClientRect();
        if (Math.abs(rect.width - 1080) <= 5 && Math.abs(rect.height - 1350) <= 5) {
          const key = `${Math.round(rect.top)}-${Math.round(rect.left)}`;
          if (!seen.has(key)) {
            seen.add(key);
            results.push(Array.from(el.parentElement.children).indexOf(el));
          }
        }
      }
      return results;
    });

    if (fallbackSlides.length > 0) {
      let exported = 0;
      for (const childIdx of fallbackSlides) {
        exported++;
        const padNum = String(exported).padStart(2, '0');
        const outPath = path.join(outDir, `${entry.prefix}_slide_${padNum}.png`);
        const el = await page.$(`body > :nth-child(${childIdx + 1})`);
        if (el) await el.screenshot({ path: outPath, type: 'png' });
      }
      await page.close();
      return exported;
    }

    await page.close();
    return 0;
  }

  // Screenshot each slide
  let exported = 0;
  for (const childIndex of slideIndices) {
    exported++;
    const padNum = String(exported).padStart(2, '0');
    const outPath = path.join(outDir, `${entry.prefix}_slide_${padNum}.png`);
    const el = await page.$(`body > :nth-child(${childIndex + 1})`);
    if (el) await el.screenshot({ path: outPath, type: 'png' });
  }

  await page.close();
  return exported;
}

async function main() {
  console.log('=== Fix Images — Re-export Modified Carousels ===');
  console.log(`Source: ${CARRUSELES}`);
  console.log(`Output: ${PUBLICACIONES}`);
  console.log(`Carousels to re-export: ${MAPPING.length}`);
  console.log('');

  const browser = await chromium.launch({ headless: true });
  const results = {};
  let totalSlides = 0;

  for (const entry of MAPPING) {
    process.stdout.write(`  ${entry.prefix} (${entry.file}) ... `);
    try {
      const count = await exportCarousel(browser, entry);
      results[entry.prefix] = count;
      totalSlides += count;
      console.log(`${count} slides`);
    } catch (err) {
      console.error(`ERROR: ${err.message}`);
      results[entry.prefix] = 0;
    }
  }

  await browser.close();

  console.log('');
  console.log('=== SUMMARY ===');
  for (const [prefix, count] of Object.entries(results)) {
    const entry = MAPPING.find(m => m.prefix === prefix);
    console.log(`  ${prefix} -> ${entry.dir}/CARRUSEL/ : ${count} slides`);
  }
  console.log(`\nTotal: ${totalSlides} slide PNGs across ${MAPPING.length} carousels`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
