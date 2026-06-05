import { chromium } from "playwright";

const OUT = "docs/design-references";
const BASE = "http://localhost:3000";

async function wait() {
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch(BASE + "/it")).ok) return true; } catch {}
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}
if (!(await wait())) { console.error("server not up"); process.exit(1); }

const browser = await chromium.launch();

// ---- public pages ----
const pub = [
  { path: "/it", file: "qa-home-it.png", w: 1440, full: true },
  { path: "/en", file: "qa-home-en.png", w: 1440, full: true },
  { path: "/it/gallery", file: "qa-gallery-it.png", w: 1440, full: false },
  { path: "/it/book", file: "qa-book-it.png", w: 1440, full: false },
];
for (const s of pub) {
  const page = await browser.newPage({ viewport: { width: s.w, height: 900 } });
  await page.goto(BASE + s.path, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/${s.file}`, fullPage: s.full });
  console.log("  shot", s.file);
  await page.close();
}

// ---- admin (login first) ----
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(BASE + "/admin/login", { waitUntil: "networkidle" });
await page.fill("#password", "barberia");
await page.click('button[type="submit"]');
await page.waitForURL("**/admin/**", { timeout: 15000 }).catch(() => {});
await page.waitForTimeout(1200);

const admin = [
  { path: "/admin/bookings", file: "qa-admin-bookings.png" },
  { path: "/admin/calendar", file: "qa-admin-calendar.png" },
  { path: "/admin/products", file: "qa-admin-products.png" },
  { path: "/admin/inventory", file: "qa-admin-inventory.png" },
];
for (const s of admin) {
  await page.goto(BASE + s.path, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/${s.file}`, fullPage: true });
  console.log("  shot", s.file);
}

await browser.close();
console.log("QA DONE");
