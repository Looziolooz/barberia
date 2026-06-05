import type { Metadata } from "next";
import { display, body } from "./fonts";
import { SITE } from "@/i18n/media";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: `${SITE.name} | Barbiere · Grooming · Wellness`, template: `%s` },
  description:
    "Barberia — barbiere, grooming e wellness premium nel cuore della città.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className={`${display.variable} ${body.variable} antialiased`}>
      <body className="min-h-screen bg-background text-foreground">{children}</body>
    </html>
  );
}
