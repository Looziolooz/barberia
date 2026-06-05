import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getAdminLocale } from "@/lib/admin-locale";
import { getDictionary } from "@/i18n/dictionaries";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function DashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }
  const locale = await getAdminLocale();
  const dict = getDictionary(locale);
  return (
    <AdminShell dict={dict} locale={locale}>
      {children}
    </AdminShell>
  );
}
