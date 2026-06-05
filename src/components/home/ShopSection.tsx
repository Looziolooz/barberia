import Image from "next/image";

import { SHOP_IMG, SHOP_BRANDS } from "@/i18n/media";
import type { Messages } from "@/i18n/messages";

export function ShopSection({ dict }: { dict: Messages }) {
  return (
    <section className="bg-background text-cream">
      <div className="mx-auto w-full max-w-[1320px] px-[clamp(1.25rem,5vw,4.5rem)] py-[clamp(4rem,10vw,9rem)] text-center">
        <div className="flex flex-wrap items-center justify-center gap-x-[clamp(1.5rem,4vw,3.5rem)] gap-y-4">
          {SHOP_BRANDS.map((brand) => (
            <span
              key={brand}
              className="font-display text-sm uppercase tracking-[0.18em] text-cream/45"
            >
              {brand}
            </span>
          ))}
        </div>

        <p className="mt-12 font-display text-[11px] uppercase tracking-[0.3em] text-cream/55">
          {dict.shop.eyebrow}
        </p>

        <p className="mx-auto mt-3 max-w-[40ch] font-sans text-[13px] uppercase leading-[1.7] tracking-[0.08em] text-cream/60">
          {dict.shop.lede}
        </p>

        <h2 className="mt-8 font-display text-[clamp(3rem,12vw,10rem)] font-black leading-[0.85] text-cream">
          {dict.shop.title}
        </h2>

        <div className="relative mt-12 aspect-[16/8] w-full overflow-hidden">
          <Image
            src={SHOP_IMG}
            alt={dict.shop.title}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
