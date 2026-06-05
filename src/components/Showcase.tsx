"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { GALLERY_PHOTOS, type GalleryPhoto } from "@/i18n/media";
import type { Messages } from "@/i18n/messages";
import { type Locale } from "@/i18n/config";

/**
 * Full-screen horizontal showcase: the STORE intro panel, then the barbershop
 * gallery — scrolled with wheel (vertical intent → horizontal), pointer drag and
 * arrow keys, eased and clamped. Mirrors the original "look around" experience.
 */
export function Showcase({ dict, locale }: { dict: Messages; locale: Locale }) {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const vp = viewport.current!;
    const tr = track.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let maxX = Math.max(0, tr.scrollWidth - vp.clientWidth);
    let target = 0;
    let current = 0;
    let raf = 0;
    const clamp = (v: number) => Math.max(0, Math.min(maxX, v));
    const measure = () => { maxX = Math.max(0, tr.scrollWidth - vp.clientWidth); target = clamp(target); };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const d = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      target = clamp(target + d);
    };
    let dragging = false, startX = 0, startTarget = 0;
    const onDown = (e: PointerEvent) => { dragging = true; startX = e.clientX; startTarget = target; };
    const onMove = (e: PointerEvent) => { if (dragging) target = clamp(startTarget - (e.clientX - startX) * 1.1); };
    const onUp = () => { dragging = false; };
    const onKey = (e: KeyboardEvent) => {
      const step = Math.min(720, vp.clientWidth * 0.6);
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { target = clamp(target + step); e.preventDefault(); }
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { target = clamp(target - step); e.preventDefault(); }
      else if (e.key === "Home") { target = 0; e.preventDefault(); }
      else if (e.key === "End") { target = maxX; e.preventDefault(); }
    };

    const loop = () => {
      current += (target - current) * (reduce ? 1 : 0.09);
      tr.style.transform = `translate3d(${-current}px,0,0)`;
      raf = requestAnimationFrame(loop);
    };

    measure();
    raf = requestAnimationFrame(loop);
    const t = setTimeout(measure, 1200);
    vp.addEventListener("wheel", onWheel, { passive: false });
    vp.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
      vp.removeEventListener("wheel", onWheel);
      vp.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div ref={viewport} className="fixed inset-0 touch-none overflow-hidden bg-background">
      <div ref={track} className="flex h-full w-max items-center will-change-transform">
        {/* STORE intro panel */}
        <section className="flex h-full w-screen shrink-0 flex-col items-center justify-center gap-[clamp(1rem,2vw,1.75rem)] px-[clamp(1.5rem,6vw,6rem)] text-center">
          <p className="font-display text-[11px] uppercase tracking-[0.32em] text-cream/70">{dict.gallery.eyebrow}</p>
          <h1 className="font-display text-[clamp(4.5rem,19vw,16rem)] font-black leading-[0.8] tracking-[0.01em] text-cream">{dict.gallery.title}</h1>
          <p className="max-w-[52ch] font-sans text-[12px] uppercase leading-[1.9] tracking-[0.1em] text-cream/65">{dict.gallery.tagline}</p>
          <Link href={`/${locale}/book`} className="mt-2 font-display text-[11px] uppercase tracking-[0.32em] text-cream/55">{dict.gallery.cta} →</Link>
        </section>

        {/* Gallery photos */}
        {GALLERY_PHOTOS.map((p: GalleryPhoto, i) => (
          <div key={i} className="flex h-full shrink-0 items-center pr-[clamp(0.75rem,2vw,1.5rem)]">
            <div className="relative h-[clamp(52svh,70svh,80svh)] bg-white/5" style={{ aspectRatio: `${p.w} / ${p.h}` }}>
              <Image src={p.src} alt={dict.gallery.alts[i]} fill sizes="80vw" className="object-cover" priority={i < 2} draggable={false} />
            </div>
          </div>
        ))}

        {/* trailing breathing space */}
        <div className="h-full w-[12vw] shrink-0" />
      </div>
    </div>
  );
}
