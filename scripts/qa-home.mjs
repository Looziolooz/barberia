import { chromium } from "playwright";

const OUT = "docs/design-references";
const browser = await chromium.launch();

async function wait() {
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch("http://localhost:3000/");
      if (r.ok) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}
if (!(await wait())) { console.error("server not up"); process.exit(1); }

const shots = [
  { path: "/", file: "home-clone-desktop.png", w: 1440, h: 900, full: true },
  { path: "/", file: "home-clone-mobile.png", w: 390, h: 844, full: true },
  { path: "/gallery", file: "gallery-clone-desktop.png", w: 1440, h: 900, full: false },
];

for (const s of shots) {
  const page = await browser.newPage({ viewport: { width: s.w, height: s.h } });
  await page.goto("http://localhost:3000" + s.path, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/${s.file}`, fullPage: s.full });
  console.log("  shot", s.file);
  await page.close();
}
await browser.close();
console.log("QA DONE");
