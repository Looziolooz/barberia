// Recon of the don-barber.gr homepage (to clone as the new "/").
import { chromium } from "playwright";
import fs from "node:fs/promises";

const PAGE_URL = "https://don-barber.gr/en/";
const REF = "docs/design-references";
const RES = "docs/research";
await fs.mkdir(REF, { recursive: true });
await fs.mkdir(RES, { recursive: true });

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let total = 0;
      const step = 600;
      const timer = setInterval(() => {
        window.scrollBy(0, step);
        total += step;
        if (total >= document.body.scrollHeight + 3000) { clearInterval(timer); resolve(); }
      }, 180);
    });
  });
  await page.waitForTimeout(1800);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
}

const EXTRACT = () => {
  const cs = (el) => getComputedStyle(el);
  const uniq = (a) => [...new Set(a.filter(Boolean))];
  const main = document.querySelector("main") || document.body;
  return {
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.content || null,
    fonts: uniq([...document.querySelectorAll("h1,h2,h3,h4,p,a,span,button")].slice(0, 400).map((e) => cs(e).fontFamily)),
    headings: [...document.querySelectorAll("h1,h2,h3,h4")].slice(0, 60).map((h) => ({ tag: h.tagName, text: h.textContent.trim().slice(0, 140), size: cs(h).fontSize, color: cs(h).color })).filter((h) => h.text),
    navLinks: uniq([...document.querySelectorAll("header a, nav a")].map((a) => `${a.textContent.trim().slice(0, 30)} -> ${a.getAttribute("href")}`)).slice(0, 40),
    buttons: uniq([...document.querySelectorAll("a.btn,.button,[class*=button],button")].map((b) => b.textContent.trim().slice(0, 40)).filter(Boolean)).slice(0, 25),
    images: uniq([...document.querySelectorAll("img")].map((i) => i.currentSrc || i.src).filter((s) => s && s.startsWith("http") && !s.includes("data:"))).slice(0, 60),
    videos: [...document.querySelectorAll("video")].map((v) => ({ src: v.src || v.querySelector("source")?.src, poster: v.poster, autoplay: v.autoplay, loop: v.loop, muted: v.muted })),
    bgImages: uniq([...document.querySelectorAll("*")].map((el) => cs(el).backgroundImage).filter((b) => b && b !== "none" && b.includes("url("))).slice(0, 25),
    sections: [...main.children].slice(0, 40).map((el) => { const r = el.getBoundingClientRect(); const s = cs(el); return { tag: el.tagName.toLowerCase(), cls: (el.className?.toString() || "").slice(0, 90), h: Math.round(r.height), bg: s.backgroundColor, text: el.textContent.replace(/\s+/g, " ").trim().slice(0, 120) }; }).filter((s) => s.h > 20),
    scrollHeight: document.body.scrollHeight,
    bodyText: document.body.innerText.replace(/\n{3,}/g, "\n\n").slice(0, 4500),
  };
};

const browser = await chromium.launch();
try {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36" });
  const page = await ctx.newPage();
  console.log("navigating home...");
  await page.goto(PAGE_URL, { waitUntil: "networkidle", timeout: 90000 });
  await autoScroll(page);
  const data = await page.evaluate(EXTRACT);
  await fs.writeFile(`${RES}/home.json`, JSON.stringify(data, null, 2));
  console.log(`home: ${data.sections.length} sections, scrollH=${data.scrollHeight}, ${data.images.length} imgs, ${data.videos.length} videos`);
  await page.screenshot({ path: `${REF}/home-orig-desktop.png`, fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(PAGE_URL, { waitUntil: "networkidle", timeout: 90000 });
  await autoScroll(page);
  await page.screenshot({ path: `${REF}/home-orig-mobile.png`, fullPage: true });
  console.log("screenshots done");
} finally {
  await browser.close();
}
console.log("HOME RECON COMPLETE");
