// Rasterize the Barberia "B" monogram (src/app/icon.svg) into the PNG icons
// Next.js serves via the file convention. SVG is all vector paths, so sharp
// renders it crisply with no font dependency.
import sharp from "sharp";
import fs from "node:fs/promises";

const svg = await fs.readFile("src/app/icon.svg");

const OUT = [
  { file: "src/app/icon.png", size: 512 },
  { file: "src/app/apple-icon.png", size: 180 },
];

for (const { file, size } of OUT) {
  await sharp(svg, { density: 384 })
    .resize(size, size)
    .png()
    .toFile(file);
  console.log("  ok", file, `${size}x${size}`);
}
console.log("DONE");
