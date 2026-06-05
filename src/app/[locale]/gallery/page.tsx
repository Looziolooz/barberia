import type { Metadata } from "next";
import { asLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Header } from "@/components/Header";
import { Showcase } from "@/components/Showcase";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(asLocale(locale));
  return { title: dict.meta.galleryTitle, description: dict.meta.galleryDescription };
}

export default async function GalleryPage({
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
        <Showcase dict={dict} locale={loc} />
      </main>
    </>
  );
}
