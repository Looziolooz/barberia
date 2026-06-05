// Grab the PFGrandGothik fonts + gallery photos from don-barber.gr, renamed to
// drop all "don-barber" references. Run: node scripts/grab-assets.mjs
import { chromium } from "playwright";
import sharp from "sharp";
import fs from "node:fs/promises";

const PAGE_URL = "https://don-barber.gr/en/perihghtheite-sto-katasthma-mas/";
const FONTS = "public/fonts";
const IMG = "public/images/gallery";
await fs.mkdir(FONTS, { recursive: true });
await fs.mkdir(IMG, { recursive: true });

const BASE = "https://don-barber.gr/wp-content/uploads/";
// Curated gallery photos (full size). Renamed target -> source.
const PHOTOS = {
  "acqua.jpg": "don-barber-and-groom-gallery-acqua.jpg",
  "client-detail.jpg": "don-barber-and-groom-gallery-client-detail.jpg",
  "feet.jpg": "don-barber-and-groom-gallery-feet.jpg",
  "client.jpg": "don-barber-and-groom-gallery-client.jpg",
  "portrait.jpg": "don-barber-and-groom-gallery-portrait.jpg",
  "orange.jpg": "don-barber-and-groom-gallery-orange.jpg",
  "owner.jpg": "don-barber-and-groom-gallery-don.jpg",
  "products.jpg": "don-barber-and-groom-gallery-products.jpg",
  "hair-cut.jpg": "don-barber-and-groom-hair-cut.jpg",
  "chair-mirror.jpg": "don-barber-and-groom-store-interior-chair-mirror.jpg",
  "reception.jpg": "don-barber-and-groom-store-interior-reception.jpg",
  "beard.jpg": "don-barber-and-groom-barber-beard.jpg",
  "leather-chair.png": "don-barber-and-groom-barbering-leather-chair.png",
  "wood-store.png": "don-barber-and-groom-barbering-wood-store.png",
};

async function dl(url, dest) {
  const res = await fetch(url);
  if (!res.ok) { console.error("  FAIL", res.status, url); return false; }
  await fs.writeFile(dest, Buffer.from(await res.arrayBuffer()));
  return true;
}

// 1) Fonts — read @font-face from the live page
const browser = await chromium.launch();
const fontUrls = [];
try {
  const page = await (await browser.newContext({ userAgent: "Mozilla/5.0 Chrome/124 Safari/537.36" })).newPage();
  await page.goto(PAGE_URL, { waitUntil: "networkidle", timeout: 90000 });
  const faces = await page.evaluate(() => {
    const out = [];
    for (const ss of document.styleSheets) {
      let rules; try { rules = ss.cssRules; } catch { continue; }
      for (const r of rules || []) {
        if (r.constructor.name === "CSSFontFaceRule") out.push({ family: r.style.fontFamily, src: r.style.src });
      }
    }
    return out;
  });
  for (const f of faces) {
    if (!/grandgothik/i.test(f.family)) continue;
    const m = f.src.match(/url\(["']?([^"')]+\.woff2?)["']?\)/i);
    if (m) fontUrls.push({ family: f.family.replace(/["']/g, ""), url: new URL(m[1], PAGE_URL).href });
  }
} finally {
  await browser.close();
}
console.log("font faces:", fontUrls.map((f) => f.family).join(", ") || "none found");

const fmap = { PFGrandGothikWide: "grandgothik-wide", PFGrandGothikWideBold: "grandgothik-bold" };
for (const f of fontUrls) {
  const base = fmap[f.family];
  if (!base) continue;
  const ext = f.url.endsWith(".woff2") ? "woff2" : "woff";
  if (await dl(f.url, `${FONTS}/${base}.${ext}`)) console.log("  font ok:", `${base}.${ext}`);
}

// 2) Photos
const manifest = [];
for (const [name, src] of Object.entries(PHOTOS)) {
  const tmp = `${IMG}/_tmp_${name}`;
  if (!(await dl(BASE + src, tmp))) continue;
  // re-encode to webp for size; keep aspect
  const out = `${IMG}/${name.replace(/\.(jpg|png)$/i, ".webp")}`;
  const m = await sharp(tmp).resize(1600, 1600, { fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toFile(out);
  await fs.unlink(tmp);
  manifest.push({ name: name.replace(/\.(jpg|png)$/i, ".webp"), src: `/images/gallery/${name.replace(/\.(jpg|png)$/i, ".webp")}`, w: m.width, h: m.height });
  console.log("  photo ok:", out, `${m.width}x${m.height}`);
}
await fs.writeFile("docs/research/gallery.json", JSON.stringify(manifest, null, 2));
console.log("DONE — fonts + " + manifest.length + " photos");
