// Admin panel language is independent of the public URL — stored in a cookie
// and toggled from the admin shell. Defaults to the site default (Italian).
import { cookies } from "next/headers";
import { asLocale, type Locale } from "@/i18n/config";

export const ADMIN_LANG_COOKIE = "barberia_admin_lang";

export async function getAdminLocale(): Promise<Locale> {
  const value = (await cookies()).get(ADMIN_LANG_COOKIE)?.value;
  return value ? asLocale(value) : "it";
}
