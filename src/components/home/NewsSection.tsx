import Image from "next/image";
import Link from "next/link";

import { NEWS_IMAGES } from "@/i18n/media";
import type { Messages } from "@/i18n/messages";

export function NewsSection({ dict }: { dict: Messages }) {
  return (
    <section id="news" className="bg-[#f6f6f6] text-[#0a0a0a]">
      <div className="mx-auto w-full max-w-[1320px] px-[clamp(1.25rem,5vw,4.5rem)] py-[clamp(4rem,10vw,9rem)]">
        <div className="text-center">
          <p className="font-display text-[11px] uppercase tracking-[0.3em] text-black/50">
            {dict.news.eyebrow}
          </p>
          <p className="mx-auto mt-3 max-w-[54ch] font-sans text-[13px] uppercase leading-[1.7] tracking-[0.08em] text-black/55">
            {dict.news.lede}
          </p>
          <h2 className="mt-6 text-center font-display text-[clamp(3.5rem,15vw,12rem)] font-black leading-[0.82]">
            {dict.news.title}
          </h2>
        </div>

        <div className="mt-[clamp(2.5rem,6vw,5rem)] grid gap-x-8 gap-y-12 md:grid-cols-3">
          {dict.news.items.map((item, index) => (
            <Link key={item.title} href="#" className="group">
              <div className="relative aspect-[3/2] w-full overflow-hidden bg-black/5">
                <Image
                  src={NEWS_IMAGES[index]}
                  alt={item.title}
                  fill
                  sizes="(max-width:768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="mt-4 flex items-center justify-between font-display text-[10px] uppercase tracking-[0.2em] text-black/45">
                <span>{item.category}</span>
                <span>{item.date}</span>
              </div>
              <h3 className="mt-2 font-display text-lg font-black uppercase leading-tight">
                {item.title}
              </h3>
            </Link>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            href="#"
            className="inline-block border border-black/40 px-6 py-3 font-display text-[11px] uppercase tracking-[0.22em] text-[#0a0a0a] transition-colors hover:bg-[#0a0a0a] hover:text-cream"
          >
            {dict.news.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
