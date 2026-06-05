import Image from "next/image";
import Link from "next/link";

import { type Locale } from "@/i18n/config";
import { SERVICE_IMAGES } from "@/i18n/media";
import type { Messages } from "@/i18n/messages";

export function ServicesSection({ dict, locale }: { dict: Messages; locale: Locale }) {
  return (
    <section id="services" className="bg-background text-cream">
      <div className="mx-auto w-full max-w-[1320px] px-[clamp(1.25rem,5vw,4.5rem)] py-[clamp(4rem,10vw,9rem)]">
        <div className="text-center">
          <p className="font-display text-[11px] uppercase tracking-[0.3em] text-cream/55">
            {dict.services.eyebrow}
          </p>
          <p className="mx-auto mt-3 max-w-[52ch] font-sans text-[13px] uppercase leading-[1.7] tracking-[0.08em] text-cream/60">
            {dict.services.lede}
          </p>
          <h2 className="mt-6 text-center font-display text-[clamp(3.5rem,15vw,12rem)] font-black leading-[0.82] text-cream">
            {dict.services.title}
          </h2>
        </div>

        <div className="mt-[clamp(2.5rem,6vw,5rem)] grid gap-x-10 gap-y-12 sm:grid-cols-3">
          {dict.services.items.map((item, index) => (
            <Link key={item.title} href={`/${locale}/book`} className="group block text-center">
              <div className="relative mx-auto aspect-square w-[clamp(8rem,16vw,12rem)] overflow-hidden rounded-full">
                <Image
                  src={SERVICE_IMAGES[index]}
                  alt={item.title}
                  fill
                  sizes="20vw"
                  className="object-cover"
                />
              </div>
              <h3 className="mt-6 font-display text-lg font-black uppercase tracking-[0.04em]">
                {item.title}
              </h3>
              <p className="mx-auto mt-3 max-w-[34ch] font-sans text-[13px] leading-[1.7] text-cream/55">
                {item.desc}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            href={`/${locale}/book`}
            className="inline-block border border-cream/50 px-6 py-3 font-display text-[11px] uppercase tracking-[0.22em] transition-colors hover:bg-cream hover:text-background"
          >
            {dict.services.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
