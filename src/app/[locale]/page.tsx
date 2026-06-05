import type { Metadata } from "next";
import { asLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Header } from "@/components/Header";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { TeamSection } from "@/components/home/TeamSection";
import { ShopSection } from "@/components/home/ShopSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { NewsSection } from "@/components/home/NewsSection";
import { SiteFooter } from "@/components/home/SiteFooter";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(asLocale(locale));
  return { title: dict.meta.homeTitle, description: dict.meta.homeDescription };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = asLocale(locale);
  const dict = getDictionary(loc);

  return (
    <>
      <Header dict={dict} locale={loc} />
      <main>
        <Hero dict={dict} locale={loc} />
        <Marquee text={dict.marquee} />
        <TeamSection dict={dict} locale={loc} />
        <ShopSection dict={dict} />
        <ServicesSection dict={dict} locale={loc} />
        <NewsSection dict={dict} />
        <Marquee text={dict.marquee} />
      </main>
      <SiteFooter dict={dict} locale={loc} />
    </>
  );
}
