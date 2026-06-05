import { NextResponse, type NextRequest } from "next/server";
import { locales, defaultLocale } from "@/i18n/config";

const LANG_COOKIE = "barberia_lang";

function detectLocale(req: NextRequest): string {
  const cookie = req.cookies.get(LANG_COOKIE)?.value;
  if (cookie && (locales as readonly string[]).includes(cookie)) return cookie;
  const accept = req.headers.get("accept-language")?.toLowerCase() ?? "";
  if (accept.startsWith("en")) return "en";
  return defaultLocale;
}

export function proxy(req: NextRequest): NextResponse | undefined {
  const { pathname } = req.nextUrl;
  const hasLocale = (locales as readonly string[]).some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (hasLocale) return;

  const locale = detectLocale(req);
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

// Public pages only — never touch /admin, /api, static assets, or files.
export const config = {
  matcher: ["/((?!admin|api|_next|images|videos|seo|favicon.ico|.*\\.).*)"],
};
