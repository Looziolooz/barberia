import Image from "next/image";
import Link from "next/link";

import { type Locale } from "@/i18n/config";
import { TEAM_OWNER_IMG } from "@/i18n/media";
import type { Messages } from "@/i18n/messages";

export function TeamSection({ dict, locale }: { dict: Messages; locale: Locale }) {
  return (
    <section id="team" className="bg-[#eceae0] text-[#0a0a0a]">
      <div className="mx-auto grid w-full max-w-[1320px] items-center gap-[clamp(2rem,5vw,4rem)] px-[clamp(1.25rem,5vw,4.5rem)] py-[clamp(4rem,10vw,9rem)] md:grid-cols-2">
        <div>
          <p className="font-display text-[11px] uppercase tracking-[0.3em] text-black/50">
            {dict.team.eyebrow}
          </p>
          <p className="mt-5 max-w-[44ch] font-sans text-[15px] leading-[1.8] text-black/70">
            {dict.team.lede}
          </p>
          <h2 className="mt-10 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-black leading-[0.95]">
            {dict.team.ownerName}
          </h2>
          <p className="mt-2 font-display text-[11px] uppercase tracking-[0.25em] text-black/55">
            {dict.team.ownerRole}
          </p>
          <Link
            href={`/${locale}#team`}
            className="mt-8 inline-block border border-black/40 px-6 py-3 font-display text-[11px] uppercase tracking-[0.22em] text-[#0a0a0a] transition-colors hover:bg-[#0a0a0a] hover:text-cream"
          >
            {dict.team.cta}
          </Link>
        </div>
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/5">
          <Image
            src={TEAM_OWNER_IMG}
            alt={dict.team.ownerName}
            fill
            sizes="(max-width:768px) 100vw, 45vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
