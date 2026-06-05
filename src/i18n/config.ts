// Locale configuration. Italian is the default (Barberia is a Milano shop);
// English is available via the /en URL prefix and the header toggle.
export const locales = ["it", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "it";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** The other locale — used by the language toggle. */
export function otherLocale(locale: Locale): Locale {
  return locale === "it" ? "en" : "it";
}

/** Coerce an unknown route param to a valid Locale (falls back to default). */
export function asLocale(value: string): Locale {
  return isLocale(value) ? value : defaultLocale;
}
