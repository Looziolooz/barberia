import type { Locale } from "./config";
import type { Messages } from "./messages";
import { en } from "./en";
import { it } from "./it";

const DICTIONARIES: Record<Locale, Messages> = { en, it };

/** The full message bundle for a locale. Safe to pass to client components. */
export function getDictionary(locale: Locale): Messages {
  return DICTIONARIES[locale];
}
