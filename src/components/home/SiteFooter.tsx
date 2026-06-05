import Link from 'next/link';

import { type Locale } from '@/i18n/config';
import { SITE } from '@/i18n/media';
import type { Messages } from '@/i18n/messages';

export function SiteFooter({ dict, locale }: { dict: Messages; locale: Locale }) {
  return (
    <footer id="contact" className="bg-background text-cream">
      <div className="mx-auto w-full max-w-[1320px] px-[clamp(1.25rem,5vw,4.5rem)] pt-[clamp(3.5rem,8vw,7rem)] pb-[clamp(2rem,4vw,3.5rem)]">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
          <div>
            <Link
              href={`/${locale}`}
              className="font-display text-2xl font-black uppercase tracking-[0.2em]"
            >
              {SITE.name}
            </Link>
            <p className="mt-5 max-w-[24ch] font-sans text-[13px] leading-relaxed text-cream/55">
              {SITE.address}
            </p>
          </div>

          <div>
            <p className="font-display text-[11px] uppercase tracking-[0.3em] text-cream/60">
              {dict.footer.contact}
            </p>
            <div className="mt-5 space-y-3">
              <a
                href={`mailto:${SITE.email}`}
                className="block font-display text-[12px] uppercase tracking-[0.16em] text-cream/70 hover:text-cream"
              >
                {SITE.email}
              </a>
              <a
                href={SITE.phoneHref}
                className="block font-display text-[12px] uppercase tracking-[0.16em] text-cream/70 hover:text-cream"
              >
                {SITE.phone}
              </a>
            </div>
          </div>

          <div className="sm:justify-self-end">
            <p className="font-display text-[11px] uppercase tracking-[0.3em] text-cream/60">
              {dict.footer.social}
            </p>
            <div className="mt-5 space-y-3">
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noreferrer"
                className="block font-display text-[12px] uppercase tracking-[0.16em] text-cream/70 hover:text-cream"
              >
                Instagram
              </a>
              <a
                href={SITE.facebook}
                target="_blank"
                rel="noreferrer"
                className="block font-display text-[12px] uppercase tracking-[0.16em] text-cream/70 hover:text-cream"
              >
                Facebook
              </a>
              <a
                href={SITE.youtube}
                target="_blank"
                rel="noreferrer"
                className="block font-display text-[12px] uppercase tracking-[0.16em] text-cream/70 hover:text-cream"
              >
                Youtube
              </a>
            </div>
          </div>
        </div>

        <p className="mt-14 border-t border-cream/12 pt-6 font-display text-[11px] uppercase tracking-[0.16em] text-cream/40">
          {dict.footer.copyright}
        </p>
      </div>
    </footer>
  );
}
