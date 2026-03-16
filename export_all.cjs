/**
 * export_all.cjs — Export all 20 Ingrid Nunez carousels to PNG
 *
 * For each carousel HTML (C01–C20), opens it in Playwright with a 1080x1350 viewport,
 * finds all slide divs (direct children of body that are 1080x1350),
 * and screenshots each one to the corresponding PUBLICACIONES/DIA_##/CARRUSEL/ folder.
 *
 * Usage: node export_all.cjs
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// Base paths
const BASE = '/Users/gerla/Documents/DLYRA/CLIENTES DLYRA/INGRID NUNEZ';
const CARRUSELES = path.join(BASE, 'CARRUSELES');
const PUBLICACIONES = path.join(BASE, 'PUBLICACIONES');

// Mapping: carousel filename -> PUBLICACIONES folder name
const MAPPING = [
  { file: 'C01-MAR14-PRESENTACION.html',       dir: 'DIA_01_SAB_14_MAR', prefix: 'C01' },
  { file: 'C02-MAR15-CRIAR-SANAR.html',        dir: 'DIA_02_LUN_16_MAR', prefix: 'C02' },
  { file: 'C03-MAR16-RABIETAS.html',            dir: 'DIA_03_MAR_17_MAR', prefix: 'C03' },
  { file: 'C04-MAR17-PANTALLAS.html',           dir: 'DIA_04_MIE_18_MAR', prefix: 'C04' },
  { file: 'C05-MAR18-FELICIDAD.html',           dir: 'DIA_05_JUE_19_MAR', prefix: 'C05' },
  { file: 'C06-MAR19-SINDROME-DOWN.html',       dir: 'DIA_06_VIE_20_MAR', prefix: 'C06' },
  { file: 'C07-MAR20-PAPA-AGOTADO.html',        dir: 'DIA_07_SAB_21_MAR', prefix: 'C07' },
  { file: 'C08-MAR22-TEASER.html',              dir: 'DIA_08_DOM_22_MAR', prefix: 'C08' },
  { file: 'C09-MAR23-TERMOSTATO.html',          dir: 'DIA_09_LUN_23_MAR', prefix: 'C09' },
  { file: 'C10-MAR24-RECONOCES.html',           dir: 'DIA_10_MAR_24_MAR', prefix: 'C10' },
  { file: 'C11-MAR25-PREVIEW-MODULOS.html',     dir: 'DIA_11_MIE_25_MAR', prefix: 'C11' },
  { file: 'C12-MAR26-LANZAMIENTO.html',         dir: 'DIA_12_JUE_26_MAR', prefix: 'C12' },
  { file: 'C13-MAR27-POST-LANZAMIENTO.html',    dir: 'DIA_13_VIE_27_MAR', prefix: 'C13' },
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

  // Verify HTML exists
  if (!fs.existsSync(htmlPath)) {
    console.error(`  SKIP ${entry.prefix}: HTML not found at ${htmlPath}`);
    return 0;
  }

  // Create output directory
  fs.mkdirSync(outDir, { recursive: true });

  // Open page
  const page = await browser.newPage({
    viewport: { width: 1080, height: 1350 },
    deviceScaleFactor: 1,
  });

  const fileUrl = 'file://' + htmlPath;
  await page.goto(fileUrl, { waitUntil: 'networkidle' });

  // Wait for fonts to load
  await page.waitForTimeout(3000);

  // Find all slide elements: direct children of body that are 1080 wide and 1350 tall
  // We use a tolerance of +/- 5px to handle sub-pixel rendering
  const slides = await page.evaluate(() => {
    const children = Array.from(document.body.children);
    const results = [];
    for (let i = 0; i < children.length; i++) {
      const el = children[i];
      const rect = el.getBoundingClientRect();
      // Accept elements that are approximately 1080x1350
      if (Math.abs(rect.width - 1080) <= 5 && Math.abs(rect.height - 1350) <= 5) {
        results.push(i);
      }
    }
    return results;
  });

  if (slides.length === 0) {
    console.error(`  WARN ${entry.prefix}: No 1080x1350 slides found! Trying fallback...`);
    // Fallback: try [class*="slide"] elements
    const fallbackSlides = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('[class*="slide"]'));
      const results = [];
      const seen = new Set();
      for (const el of els) {
        const rect = el.getBoundingClientRect();
        if (Math.abs(rect.width - 1080) <= 5 && Math.abs(rect.height - 1350) <= 5) {
          // Avoid duplicates (nested elements)
          const key = `${Math.round(rect.top)}-${Math.round(rect.left)}`;
          if (!seen.has(key)) {
            seen.add(key);
            results.push({
              selector: el.tagName.toLowerCase() +
                (el.id ? '#' + el.id : '') +
                (el.className ? '.' + el.className.split(' ').join('.') : ''),
              index: Array.from(el.parentElement.children).indexOf(el),
              parentTag: el.parentElement.tagName.toLowerCase(),
            });
          }
        }
      }
      return results;
    });

    if (fallbackSlides.length > 0) {
      let slideNum = 0;
      for (const info of fallbackSlides) {
        slideNum++;
        const el = await page.$(`${info.parentTag} > :nth-child(${info.index + 1})`);
        if (el) {
          const padNum = String(slideNum).padStart(2, '0');
          const outPath = path.join(outDir, `${entry.prefix}_slide_${padNum}.png`);
          await el.screenshot({ path: outPath, type: 'png' });
        }
      }
      await page.close();
      console.log(`  ${entry.prefix}: ${slideNum} slides (fallback)`);
      return slideNum;
    }

    await page.close();
    return 0;
  }

  // Screenshot each slide
  let exported = 0;
  for (let i = 0; i < slides.length; i++) {
    const childIndex = slides[i];
    const el = await page.$(`body > :nth-child(${childIndex + 1})`);
    if (el) {
      exported++;
      const padNum = String(exported).padStart(2, '0');
      const outPath = path.join(outDir, `${entry.prefix}_slide_${padNum}.png`);
      await el.screenshot({ path: outPath, type: 'png' });
    }
  }

  await page.close();
  return exported;
}

async function main() {
  console.log('=== Carousel PNG Export ===');
  console.log(`Carousels source: ${CARRUSELES}`);
  console.log(`Output base: ${PUBLICACIONES}`);
  console.log('');

  const browser = await chromium.launch({ headless: true });
  const results = {};
  let totalSlides = 0;

  for (const entry of MAPPING) {
    process.stdout.write(`Exporting ${entry.prefix} (${entry.file})...`);
    try {
      const count = await exportCarousel(browser, entry);
      results[entry.prefix] = count;
      totalSlides += count;
      console.log(` ${count} slides`);
    } catch (err) {
      console.error(` ERROR: ${err.message}`);
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
  console.log(`\nTotal: ${totalSlides} slide PNGs exported across ${MAPPING.length} carousels`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
