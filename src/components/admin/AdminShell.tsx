"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type Locale, locales } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";

export function AdminShell({
  dict,
  locale,
  children,
}: {
  dict: Messages;
  locale: Locale;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { href: "/admin/bookings", label: dict.admin.nav.bookings },
    { href: "/admin/calendar", label: dict.admin.nav.calendar },
    { href: "/admin/products", label: dict.admin.nav.products },
    { href: "/admin/inventory", label: dict.admin.nav.inventory },
  ] as const;

  async function changeLocale(next: Locale) {
    await fetch("/api/admin/lang", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: next }),
    });
    router.refresh();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-cream sm:flex-row">
      <aside className="flex flex-col border-b border-cream/15 p-6 sm:w-60 sm:border-b-0 sm:border-r">
        <div className="font-display text-sm uppercase tracking-[0.2em]">
          {dict.admin.brand}
        </div>

        <nav className="mt-10 flex flex-col">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active
                    ? "block border-l-2 border-cream py-2 pl-3 font-display text-[12px] uppercase tracking-[0.18em] text-cream"
                    : "block py-2 pl-3 font-display text-[12px] uppercase tracking-[0.18em] text-cream/55 hover:text-cream"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-10">
          <div className="flex gap-3">
            {locales.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => changeLocale(code)}
                className={
                  code === locale
                    ? "font-display text-[11px] uppercase tracking-[0.2em] text-cream"
                    : "font-display text-[11px] uppercase tracking-[0.2em] text-cream/45 transition-colors hover:text-cream"
                }
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={logout}
            className="mt-6 border border-cream/50 px-4 py-2 font-display text-[11px] uppercase tracking-[0.22em] transition-colors hover:bg-cream hover:text-background"
          >
            {dict.admin.logout}
          </button>
        </div>
      </aside>

      <main className="flex-1 px-6 py-10 sm:px-10">{children}</main>
    </div>
  );
}
