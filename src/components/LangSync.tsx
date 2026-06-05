"use client";

import { useEffect } from "react";
import type { Locale } from "@/i18n/config";

/** Keeps <html lang> in sync with the active locale (root layout is static). */
export function LangSync({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
