import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { SERVICES, BARBERS } from "@/content/booking";
import { BookingForm } from "@/components/BookingForm";

export const metadata: Metadata = {
  title: "Barberia | Book your appointment",
  description: "Book your appointment at Barberia.",
};

export default function BookPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background px-[clamp(1.25rem,5vw,4.5rem)] pt-[clamp(7rem,14vh,10rem)] pb-24">
        <p className="font-display text-[11px] uppercase tracking-[0.32em] text-cream/60">
          Reserve your chair
        </p>
        <h1 className="font-display text-[clamp(3rem,10vw,8rem)] font-black leading-[0.85] text-cream mt-3">
          Book
        </h1>
        <div className="mt-10 max-w-2xl">
          <BookingForm services={SERVICES} barbers={BARBERS} />
        </div>
      </main>
    </>
  );
}
