import type { Metadata } from "next";
import { asLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { SERVICES, BARBERS } from "@/content/booking";
import { Header } from "@/components/Header";
import { BookingForm } from "@/components/BookingForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(asLocale(locale));
  return { title: dict.meta.bookTitle, description: dict.meta.bookDescription };
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = asLocale(locale);
  const dict = getDictionary(loc);

  const services = SERVICES.map((s) => ({
    id: s.id,
    name: dict.serviceNames[s.id] ?? s.id,
    duration: s.duration,
    price: s.price,
  }));
  const barbers = BARBERS.map((b) => ({
    id: b.id,
    name: dict.barberNames[b.id] ?? b.id,
  }));

  return (
    <>
      <Header dict={dict} locale={loc} />
      <main className="min-h-screen bg-background px-[clamp(1.25rem,5vw,4.5rem)] pt-[clamp(7rem,14vh,10rem)] pb-24">
        <p className="font-display text-[11px] uppercase tracking-[0.32em] text-cream/60">
          {dict.book.eyebrow}
        </p>
        <h1 className="font-display text-[clamp(3rem,10vw,8rem)] font-black leading-[0.85] text-cream mt-3">
          {dict.book.title}
        </h1>
        <div className="mt-10 max-w-2xl">
          <BookingForm dict={dict} services={services} barbers={barbers} />
        </div>
      </main>
    </>
  );
}
