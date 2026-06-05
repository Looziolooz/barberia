"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/i18n/media";
import { type Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";
import { cn } from "@/lib/utils";

/** Fixed dark chrome — wordmark · phone · Book now · menu — over the showcase. */
export function Header({ dict, locale }: { dict: Messages; locale: Locale }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const rest = pathname.replace(/^\/(it|en)/, "");

  const nav = [
    { label: dict.nav.home, href: `/${locale}` },
    { label: dict.nav.gallery, href: `/${locale}/gallery` },
    { label: dict.nav.team, href: `/${locale}#team` },
    { label: dict.nav.services, href: `/${locale}#services` },
    { label: dict.nav.news, href: `/${locale}#news` },
    { label: dict.nav.book, href: `/${locale}/book` },
    { label: dict.nav.contact, href: `/${locale}#contact` },
  ];

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/70 to-transparent" />
        <div className="relative flex items-center justify-between px-[clamp(1rem,3vw,2.75rem)] py-[clamp(1rem,1.8vw,1.5rem)] text-cream">
          <Link href={`/${locale}`} className="font-display text-[clamp(1.15rem,1.9vw,1.7rem)] font-black tracking-[0.2em]">
            {SITE.name}
          </Link>

          <div className="flex items-center gap-[clamp(0.85rem,2vw,2rem)]">
            <a href={SITE.phoneHref} className="hidden font-display text-[11px] uppercase tracking-[0.22em] transition-opacity hover:opacity-60 md:inline">
              {SITE.phone}
            </a>
            <Link href={`/${locale}/book`} className="hidden border border-cream/50 px-4 py-2 font-display text-[11px] uppercase tracking-[0.22em] transition-colors hover:bg-cream hover:text-background sm:inline-block">
              {dict.header.book}
            </Link>
            <button onClick={() => setOpen(true)} aria-label={dict.header.openMenu} className="flex h-6 w-7 flex-col justify-center gap-[6px]">
              <span className="block h-[2px] w-full bg-cream" />
              <span className="block h-[2px] w-full bg-cream" />
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen menu */}
      <div
        className={cn(
          "fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-background text-cream transition-opacity duration-500",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="flex items-center justify-between px-[clamp(1rem,3vw,2.75rem)] py-[clamp(1rem,1.8vw,1.5rem)]">
          <span className="font-display text-[clamp(1.15rem,1.9vw,1.7rem)] font-black tracking-[0.2em]">{SITE.name}</span>
          <button onClick={() => setOpen(false)} className="font-display text-[11px] uppercase tracking-[0.28em] transition-opacity hover:opacity-60">
            {dict.header.close}
          </button>
        </div>

        <nav className="flex flex-1 flex-col justify-center gap-1 px-[clamp(1.25rem,6vw,6rem)] py-10">
          {nav.map((n) => (
            <Link
              key={n.label}
              href={n.href}
              onClick={() => setOpen(false)}
              className="font-display w-fit text-[clamp(2rem,6vw,4.5rem)] font-black leading-[1.04] tracking-[0.02em] text-cream/80 transition-colors hover:text-cream"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-4 px-[clamp(1.25rem,6vw,6rem)] py-[clamp(1.5rem,3vw,3rem)] font-display text-[11px] uppercase tracking-[0.22em] text-cream/60">
          <a href={SITE.phoneHref} className="hover:text-cream">{SITE.phone}</a>
          <a href={SITE.instagram} target="_blank" rel="noreferrer" className="hover:text-cream">Instagram</a>
          <Link href="/admin" onClick={() => setOpen(false)} className="hover:text-cream">
            Admin
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href={`/it${rest}`}
              onClick={() => { document.cookie = "barberia_lang=it;path=/;max-age=31536000"; }}
              className={cn(
                "font-display text-[11px] uppercase tracking-[0.22em] transition-colors",
                locale === "it" ? "text-cream" : "text-cream/50 hover:text-cream",
              )}
            >
              IT
            </Link>
            <span aria-hidden className="h-3 w-px bg-cream/30" />
            <Link
              href={`/en${rest}`}
              onClick={() => { document.cookie = "barberia_lang=en;path=/;max-age=31536000"; }}
              className={cn(
                "font-display text-[11px] uppercase tracking-[0.22em] transition-colors",
                locale === "en" ? "text-cream" : "text-cream/50 hover:text-cream",
              )}
            >
              EN
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
