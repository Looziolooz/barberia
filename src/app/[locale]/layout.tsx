import { notFound } from "next/navigation";
import { isLocale, locales } from "@/i18n/config";
import { LangSync } from "@/components/LangSync";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <>
      <LangSync locale={locale} />
      {children}
    </>
  );
}
