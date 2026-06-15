"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { type Locale } from "@/i18n/config";
import { HERO_FRAMES } from "@/i18n/media";
import type { Messages } from "@/i18n/messages";

// How much vertical scroll (in viewport heights) the frame sequence spans.
// The section is this tall; the inner stage is sticky for the whole span,
// so 1 extra screen-height of scroll = the full 36-frame playthrough.
const SCROLL_VH = 220;

export function Hero({ dict, locale }: { dict: Messages; locale: Locale }) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frameCount = HERO_FRAMES.length;
    const images: HTMLImageElement[] = [];
    let loaded = 0;
    let raf = 0;

    // Continuous frame position (0 .. frameCount-1). `current` eases toward
    // `target` for an inertial, slow-motion feel; the fractional part drives a
    // crossfade between adjacent frames so motion reads as a smooth dissolve
    // rather than a hard frame swap.
    let target = 0;
    let current = 0;
    let drawn = -1; // last rendered `current`, to skip redundant repaints

    const ready = (i: number) => {
      const img = images[i];
      return !!img && img.complete && img.naturalWidth > 0;
    };

    // Paint one image with object-cover semantics (optionally translucent for
    // crossfade). Does not clear — the caller manages clearing/layering.
    const paintCover = (img: HTMLImageElement, alpha: number) => {
      const cw = canvas.width;
      const ch = canvas.height;
      if (cw === 0 || ch === 0) return;
      const ir = img.naturalWidth / img.naturalHeight;
      const cr = cw / ch;
      let dw: number;
      let dh: number;
      if (ir > cr) {
        dh = ch;
        dw = ch * ir;
      } else {
        dw = cw;
        dh = cw / ir;
      }
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
      ctx.globalAlpha = 1;
    };

    const renderFloat = (value: number) => {
      const v = Math.max(0, Math.min(frameCount - 1, value));
      const base = Math.floor(v);
      const frac = v - base;
      if (!ready(base)) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      paintCover(images[base], 1);
      // Blend in the next frame proportionally to the fractional position.
      if (frac > 0.001 && ready(base + 1)) {
        paintCover(images[base + 1], frac);
      }
      drawn = v;
    };

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      drawn = -1;
      renderFloat(current);
    };

    const targetForScroll = () => {
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      const progress = total > 0 ? scrolled / total : 0;
      return progress * (frameCount - 1);
    };

    // Easing loop: lerp `current` toward `target` and repaint until settled.
    // Lower EASE = slower, more pronounced slow-motion catch-up.
    const EASE = 0.1;
    const tick = () => {
      const diff = target - current;
      if (Math.abs(diff) < 0.0015) {
        current = target;
        if (Math.abs(drawn - current) > 0.0015) renderFloat(current);
        raf = 0;
        return;
      }
      current += diff * EASE;
      renderFloat(current);
      raf = requestAnimationFrame(tick);
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const onScroll = () => {
      target = targetForScroll();
      kick();
    };

    // Initialize position from the current scroll so there's no jump on load.
    target = reduceMotion ? 0 : targetForScroll();
    current = target;

    // Preload every frame; render as soon as the relevant frames arrive.
    HERO_FRAMES.forEach((src, i) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
      img.onload = () => {
        loaded += 1;
        if (i === Math.floor(current) || i === Math.floor(current) + 1) {
          renderFloat(current);
        }
        if (loaded === frameCount) renderFloat(current);
      };
      images[i] = img;
    });

    sizeCanvas();

    if (!reduceMotion) {
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    window.addEventListener("resize", sizeCanvas);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", sizeCanvas);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-background text-cream"
      style={{ height: `${SCROLL_VH}vh` }}
    >
      {/* Sticky stage: pinned for the whole scroll span while frames scrub. */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          aria-hidden
          className="absolute inset-0 h-full w-full"
        />

        {/* Dark overlay over the frames for legibility / mood. */}
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/35" />

        {/* Hero content, pinned to the bottom of the stage. */}
        <div className="relative z-10 mx-auto flex h-full w-full max-w-[1320px] flex-col justify-end px-[clamp(1.25rem,5vw,4.5rem)] pb-[clamp(3rem,8vw,6rem)] pt-[clamp(7rem,16vh,11rem)]">
          <p className="font-display text-[11px] uppercase tracking-[0.3em] text-cream/70">
            {dict.hero.eyebrow}
          </p>

          <div className="mt-4">
            {dict.hero.categories.map((category) => (
              <span
                key={category}
                className="font-display block text-[clamp(2.25rem,6.5vw,5.5rem)] font-black leading-[0.95] text-cream transition-opacity hover:opacity-60"
              >
                {category}
              </span>
            ))}
          </div>

          <p className="mt-6 max-w-[46ch] font-sans text-[13px] uppercase leading-[1.8] tracking-[0.08em] text-cream/65">
            {dict.hero.intro}
          </p>

          <Link
            href={`/${locale}/book`}
            className="mt-9 inline-block w-fit border border-cream/50 px-6 py-3 font-display text-[11px] uppercase tracking-[0.22em] transition-colors hover:bg-cream hover:text-background"
          >
            {dict.hero.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
