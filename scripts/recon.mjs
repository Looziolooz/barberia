// Phase 1 reconnaissance for the don-barber.gr clone.
import { chromium } from "playwright";
import fs from "node:fs/promises";

const URL = "https://don-barber.gr/en/perihghtheite-sto-katasthma-mas/";
const REF = "docs/design-references";
const RES = "docs/research";
await fs.mkdir(REF, { recursive: true });
await fs.mkdir(RES, { recursive: true });

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let total = 0;
      const step = 500;
      const timer = setInterval(() => {
        window.scrollBy(0, step);
        total += step;
        if (total >= document.body.scrollHeight + 2500) { clearInterval(timer); resolve(); }
      }, 160);
    });
  });
  await page.waitForTimeout(1500);
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
    generator: document.querySelector('meta[name="generator"]')?.content || null,
    lang: document.documentElement.lang,
    scriptHosts: uniq([...document.scripts].map((s) => { try { return new URL(s.src).host; } catch { return null; } })).slice(0, 20),
    bodyBg: cs(document.body).backgroundColor,
    bodyColor: cs(document.body).color,
    fonts: uniq([...document.querySelectorAll("h1,h2,h3,h4,p,a,span,button,li")].slice(0, 400).map((e) => cs(e).fontFamily)),
    headings: [...document.querySelectorAll("h1,h2,h3")].slice(0, 40).map((h) => ({ tag: h.tagName, text: h.textContent.trim().slice(0, 120), font: cs(h).fontFamily, size: cs(h).fontSize, weight: cs(h).fontWeight, color: cs(h).color, transform: cs(h).textTransform })),
    navLinks: uniq([...document.querySelectorAll("header a, nav a")].map((a) => `${a.textContent.trim().slice(0, 30)} -> ${a.getAttribute("href")}`)).slice(0, 40),
    buttons: uniq([...document.querySelectorAll("button, a.btn, .button, [class*=button]")].map((b) => b.textContent.trim().slice(0, 40)).filter(Boolean)).slice(0, 20),
    images: [...document.querySelectorAll("img")].map((img) => ({ src: img.currentSrc || img.src, alt: img.alt, w: img.naturalWidth, h: img.naturalHeight })).filter((i) => i.src).slice(0, 120),
    videos: [...document.querySelectorAll("video")].map((v) => ({ src: v.src || v.querySelector("source")?.src, poster: v.poster, autoplay: v.autoplay, loop: v.loop })),
    bgImages: uniq([...document.querySelectorAll("*")].map((el) => cs(el).backgroundImage).filter((b) => b && b !== "none" && b.includes("url("))).slice(0, 30),
    sections: [...main.children].slice(0, 30).map((el) => { const r = el.getBoundingClientRect(); const s = cs(el); return { tag: el.tagName.toLowerCase(), cls: (el.className?.toString() || "").slice(0, 90), h: Math.round(r.height), bg: s.backgroundColor, text: el.textContent.trim().slice(0, 90) }; }),
    scrollHeight: document.body.scrollHeight,
    smoothScroll: { lenis: !!document.querySelector(".lenis"), locomotive: !!document.querySelector("[data-scroll-container]") },
    bodyTextSample: document.body.innerText.replace(/\n{3,}/g, "\n\n").slice(0, 3000),
  };
};

const browser = await chromium.launch();
try {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36" });
  const page = await ctx.newPage();
  console.log("navigating (desktop)...");
  await page.goto(URL, { waitUntil: "networkidle", timeout: 90000 });
  await autoScroll(page);
  const data = await page.evaluate(EXTRACT);
  await fs.writeFile(`${RES}/recon.json`, JSON.stringify(data, null, 2));
  console.log(`extracted: ${data.images.length} imgs, ${data.sections.length} sections, scrollH=${data.scrollHeight}, fonts=${data.fonts.length}`);
  await page.screenshot({ path: `${REF}/desktop-full.png`, fullPage: true });
  console.log("desktop screenshot done");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(URL, { waitUntil: "networkidle", timeout: 90000 });
  await autoScroll(page);
  await page.screenshot({ path: `${REF}/mobile-full.png`, fullPage: true });
  console.log("mobile screenshot done");
} finally {
  await browser.close();
}
console.log("RECON COMPLETE");
