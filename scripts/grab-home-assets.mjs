// Download homepage photos from don-barber.gr, renamed (no "don-barber" refs).
import sharp from "sharp";
import fs from "node:fs/promises";

const BASE = "https://don-barber.gr/wp-content/uploads/";
const OUT = "public/images/home";
await fs.mkdir(OUT, { recursive: true });

const PHOTOS = {
  "entrance.webp": "don-barber-and-groom-entrance-exterior.jpg",
  "svc-barbering.webp": "don-barber-and-groom-service-barbering.jpg",
  "svc-wellness.webp": "don-barber-and-groom-services-wellness.jpg",
  "svc-hands.webp": "don-barber-and-groom-service-hand-and-feet.jpg",
  "shop.webp": "don-barber-and-groom-shop-online-reception.jpg",
  "team.webp": "don-barber-and-groom-featured-gallery-about.jpg",
  "owner.webp": "1-%CE%99%CE%A9%CE%91%CE%9D%CE%9D%CE%97%CE%A3-%CE%A3%CE%91%CE%9A%CE%95%CE%9B%CE%9B%CE%91%CE%A1%CE%91%CE%9A%CE%97%CE%A3-OWNER-MASTER-BARBER-2.jpg",
  "news-1.webp": "don-barber-and-groom-reflexology-1-768x512.jpg",
  "news-2.webp": "don-barber-and-groom-dirty-768x512.jpg",
  "news-3.webp": "don-barber-and-groom-winter-accessories-768x512.jpg",
};

const manifest = [];
for (const [name, src] of Object.entries(PHOTOS)) {
  const res = await fetch(BASE + src);
  if (!res.ok) { console.error("  FAIL", res.status, name); continue; }
  const buf = Buffer.from(await res.arrayBuffer());
  const out = `${OUT}/${name}`;
  const m = await sharp(buf).resize(1600, 1600, { fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toFile(out);
  manifest.push({ name, src: `/images/home/${name}`, w: m.width, h: m.height });
  console.log("  ok", name, `${m.width}x${m.height}`);
}
await fs.writeFile("docs/research/home-assets.json", JSON.stringify(manifest, null, 2));
console.log("DONE — " + manifest.length + " home photos");
