#!/usr/bin/env python3
"""Export all carousel HTML files to PNG slides using Playwright."""

import os
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

CARRUSELES_DIR = Path(__file__).parent / "CARRUSELES"
OUTPUT_DIR = Path(__file__).parent / "CARRUSELES-PNG"

SLIDE_W = 1080
SLIDE_H = 1350

# JS to find all top-level slide containers (1080×1350 divs)
FIND_SLIDES_JS = """() => {
    // Try class="slide*" first, then fallback to dimension-based detection
    const byClass = Array.from(document.querySelectorAll('div[class*="slide"]'))
        .filter(el => {
            const r = el.getBoundingClientRect();
            return Math.abs(r.width - 1080) < 5 && Math.abs(r.height - 1350) < 5;
        });
    if (byClass.length > 0) return byClass.map(el => {
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, width: 1080, height: 1350 };
    });
    // Fallback: any element that is exactly 1080×1350
    return Array.from(document.querySelectorAll('*'))
        .filter(el => {
            const r = el.getBoundingClientRect();
            return Math.abs(r.width - 1080) < 5 && Math.abs(r.height - 1350) < 5;
        })
        .filter((el, _, arr) => !arr.some(p => p !== el && p.contains(el)))
        .map(el => {
            const r = el.getBoundingClientRect();
            return { x: r.x, y: r.y, width: 1080, height: 1350 };
        });
}"""

async def export_carrusel(page, html_file: Path):
    output_dir = OUTPUT_DIR / html_file.stem
    output_dir.mkdir(parents=True, exist_ok=True)

    url = f"file://{html_file.resolve()}"
    await page.goto(url, wait_until="networkidle")
    await page.wait_for_timeout(2000)

    clips = await page.evaluate(FIND_SLIDES_JS)
    slide_count = len(clips)
    print(f"  {html_file.name}: {slide_count} slides")

    for i, clip in enumerate(clips):
        slide_num = str(i + 1).zfill(2)
        out_file = output_dir / f"slide-{slide_num}.png"
        await page.screenshot(
            path=str(out_file),
            clip={"x": clip["x"], "y": clip["y"], "width": 1080, "height": 1350}
        )

    return slide_count

async def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    html_files = sorted(CARRUSELES_DIR.glob("*.html"))
    print(f"Found {len(html_files)} carousel files\n")

    async with async_playwright() as pw:
        browser = await pw.chromium.launch()
        page = await browser.new_page()
        await page.set_viewport_size({"width": 1080, "height": 27000})

        total = 0
        for html_file in html_files:
            print(f"Exporting {html_file.name}...", end=" ", flush=True)
            try:
                count = await export_carrusel(page, html_file)
                total += count
                print("✓")
            except Exception as e:
                print(f"✗ ERROR: {e}")

        await browser.close()
        print(f"\nDone. {total} slides exported to {OUTPUT_DIR}")

if __name__ == "__main__":
    asyncio.run(main())
