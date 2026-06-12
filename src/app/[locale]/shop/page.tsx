import type { Metadata } from "next";
import { asLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { listProducts } from "@/lib/products";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { SiteFooter } from "@/components/home/SiteFooter";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(asLocale(locale));
  return { title: dict.meta.shopTitle, description: dict.meta.shopDescription };
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = asLocale(locale);
  const dict = getDictionary(loc);
  const products = (await listProducts()).filter((p) => p.active);

  return (
    <>
      <div className="min-h-screen bg-background pt-32 text-cream">
        <div className="mx-auto w-full max-w-[1320px] px-[clamp(1.25rem,5vw,4.5rem)]">
          <p className="font-display text-[11px] uppercase tracking-[0.3em] text-cream/55">
            {dict.shopPage.title}
          </p>
          <h1 className="mt-3 font-display text-[clamp(2.5rem,8vw,6rem)] font-black leading-[0.9] text-cream">
            {dict.shop.eyebrow}
          </h1>
          <p className="mt-4 max-w-[50ch] font-sans text-[13px] uppercase leading-[1.7] tracking-[0.08em] text-cream/60">
            {dict.shopPage.tagline}
          </p>
        </div>

        <div className="mx-auto mt-16 w-full max-w-[1320px] px-[clamp(1.25rem,5vw,4.5rem)] pb-32">
          <ProductGrid products={products} dict={dict} />
        </div>
      </div>
      <SiteFooter dict={dict} locale={loc} />
    </>
  );
}
