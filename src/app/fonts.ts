import { Archivo, Inter } from "next/font/google";

/** Bold geometric grotesque — free stand-in for the original PFGrandGothik Wide. */
export const display = Archivo({
  variable: "--font-saira",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800", "900"],
  display: "swap",
});

/** Body / UI sans. */
export const body = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});
