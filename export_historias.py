#!/usr/bin/env python3
"""Export all 105 story slides from HISTORIAS-MES.html to PNG."""

import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

HTML_FILE = Path(__file__).parent / "HISTORIAS-MES.html"
OUTPUT_DIR = Path(__file__).parent / "HISTORIAS-PNG"

SLIDE_W = 1080
SLIDE_H = 1920

FIND_SLIDES_JS = """() => {
    return Array.from(document.querySelectorAll('div.slide'))
        .filter(el => {
            const r = el.getBoundingClientRect();
            return Math.abs(r.width - 1080) < 5 && Math.abs(r.height - 1920) < 5;
        })
        .map(el => {
            const r = el.getBoundingClientRect();
            const fecha = el.getAttribute('data-fecha') || '';
            return { x: r.x, y: r.y, width: 1080, height: 1920, fecha };
        });
}"""

async def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    url = f"file://{HTML_FILE.resolve()}"

    async with async_playwright() as pw:
        browser = await pw.chromium.launch()
        page = await browser.new_page()
        await page.set_viewport_size({"width": 1080, "height": 210000})
        await page.goto(url, wait_until="networkidle")
        await page.wait_for_timeout(3000)

        clips = await page.evaluate(FIND_SLIDES_JS)
        print(f"Found {len(clips)} story slides\n")

        # label cada slide con H1/H2/H3 según su orden dentro del día
        day_counter = {}
        for i, clip in enumerate(clips):
            fecha = clip.get("fecha", f"slide-{i:03d}")
            day_counter[fecha] = day_counter.get(fecha, 0) + 1
            slot_num = day_counter[fecha]
            slot_label = ["H1","H2","H3"][slot_num - 1] if slot_num <= 3 else f"S{slot_num}"

            # sanitize filename
            safe_fecha = fecha.replace(" ","_").replace("/","-")
            out_file = OUTPUT_DIR / f"{safe_fecha}_{slot_label}.png"

            await page.screenshot(
                path=str(out_file),
                clip={"x": clip["x"], "y": clip["y"], "width": 1080, "height": 1920}
            )
            if (i + 1) % 15 == 0 or i == len(clips) - 1:
                print(f"  [{i+1}/{len(clips)}] {out_file.name}")

        await browser.close()
        print(f"\n✓ Done. {len(clips)} story PNGs saved to {OUTPUT_DIR}")

if __name__ == "__main__":
    asyncio.run(main())
