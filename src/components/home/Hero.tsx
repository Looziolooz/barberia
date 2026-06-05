import Image from "next/image";
import Link from "next/link";

import { type Locale } from "@/i18n/config";
import { HERO_BG } from "@/i18n/media";
import type { Messages } from "@/i18n/messages";

export function Hero({ dict, locale }: { dict: Messages; locale: Locale }) {
  return (
    <section className="relative min-h-screen bg-background text-cream">
      <Image
        src={HERO_BG}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/40" />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1320px] flex-col justify-end px-[clamp(1.25rem,5vw,4.5rem)] pb-[clamp(3rem,8vw,6rem)] pt-[clamp(7rem,16vh,11rem)]">
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
    </section>
  );
}
