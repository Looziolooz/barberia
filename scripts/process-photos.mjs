// Process owner-supplied photos (Pictures/barberia) into optimized webp.
// Sources are small screenshots, so we NEVER upscale thumbnails (keeps them
// sharp); only the hero is mildly enlarged because it sits under a dark overlay.
import sharp from "sharp";
import fs from "node:fs/promises";

const SRC = "C:/Users/loren/Pictures/barberia";
const S = (n) => `${SRC}/${n}`;
const G = "Gemini_Generated_Image_ey30nrey30nrey30.png";
const FE = "ferraro.png";
const SH = (t) => `Screenshot 2026-06-05 ${t}.png`;

// mode: "inside" (fit, no enlarge) | "cover" (crop to ratio w/h, capped to native) | "hero" (enlarge ok)
const JOBS = [
  // ---- home ----
  { in: G, out: "public/images/home/hero.webp", mode: "hero", w: 1600 },
  { in: FE, out: "public/images/home/owner.webp", mode: "inside", w: 1000 },
  { in: SH("132238"), out: "public/images/home/shop.webp", mode: "cover", w: 1600, h: 760 },
  { in: SH("132447"), out: "public/images/home/svc-barbering.webp", mode: "cover", w: 900, h: 900 },
  { in: SH("132433"), out: "public/images/home/svc-wellness.webp", mode: "cover", w: 900, h: 900 },
  { in: SH("132323"), out: "public/images/home/svc-hands.webp", mode: "cover", w: 900, h: 900 },
  { in: SH("132501"), out: "public/images/home/news-1.webp", mode: "cover", w: 1200, h: 800 },
  { in: SH("132300"), out: "public/images/home/news-2.webp", mode: "cover", w: 1200, h: 800 },
  { in: SH("132416"), out: "public/images/home/news-3.webp", mode: "cover", w: 1200, h: 800 },
  { in: G, out: "public/images/home/interior.webp", mode: "inside", w: 1200 },
  // ---- gallery (natural aspect) ----
  { in: G, out: "public/images/gallery/welcome.webp", mode: "inside", w: 1200 },
  { in: FE, out: "public/images/gallery/owner.webp", mode: "inside", w: 1200 },
  { in: SH("132238"), out: "public/images/gallery/chairs.webp", mode: "inside", w: 1600 },
  { in: SH("132300"), out: "public/images/gallery/shave-kit.webp", mode: "inside", w: 1600 },
  { in: SH("132323"), out: "public/images/gallery/treatment.webp", mode: "inside", w: 1600 },
  { in: SH("132339"), out: "public/images/gallery/lounge.webp", mode: "inside", w: 1600 },
  { in: SH("132416"), out: "public/images/gallery/reception.webp", mode: "inside", w: 1600 },
  { in: SH("132433"), out: "public/images/gallery/beard.webp", mode: "inside", w: 1600 },
  { in: SH("132447"), out: "public/images/gallery/haircut.webp", mode: "inside", w: 1600 },
  { in: SH("132501"), out: "public/images/gallery/products.webp", mode: "inside", w: 1600 },
  // ---- products (square) ----
  { in: SH("132501"), out: "public/images/products/post-shave.webp", mode: "cover", w: 900, h: 900 },
  { in: SH("132300"), out: "public/images/products/shave-kit.webp", mode: "cover", w: 900, h: 900 },
  { in: SH("132339"), out: "public/images/products/pomade.webp", mode: "cover", w: 900, h: 900 },
];

// fresh gallery dir; drop orphaned home images
await fs.rm("public/images/gallery", { recursive: true, force: true });
await fs.rm("public/images/home/entrance.webp", { force: true });
await fs.rm("public/images/home/team.webp", { force: true });
for (const d of ["home", "gallery", "products"]) await fs.mkdir(`public/images/${d}`, { recursive: true });

const manifest = [];
for (const j of JOBS) {
  const src = sharp(S(j.in)).rotate();
  const meta = await src.metadata();
  let pipe = src;
  if (j.mode === "hero") {
    pipe = pipe.resize(j.w, null, { fit: "inside", kernel: "lanczos3" });
  } else if (j.mode === "cover") {
    // cap target box to native so we never upscale a small screenshot
    const ratio = j.w / j.h;
    let w = Math.min(j.w, meta.width);
    let h = Math.round(w / ratio);
    if (h > meta.height) { h = meta.height; w = Math.round(h * ratio); }
    pipe = pipe.resize(w, h, { fit: "cover", position: "attention" });
  } else {
    pipe = pipe.resize(j.w, null, { fit: "inside", withoutEnlargement: true });
  }
  const m = await pipe.webp({ quality: 86 }).toFile(j.out);
  manifest.push({ out: "/" + j.out.replace("public/", ""), w: m.width, h: m.height });
  console.log("  ok", j.out.replace("public/images/", ""), `${m.width}x${m.height}`);
}
await fs.writeFile("docs/research/photos.json", JSON.stringify(manifest, null, 2));
console.log("DONE — " + manifest.length + " photos");
