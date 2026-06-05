import { getAdminLocale } from "@/lib/admin-locale";
import { getDictionary } from "@/i18n/dictionaries";
import { LoginForm } from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const locale = await getAdminLocale();
  const dict = getDictionary(locale);
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <LoginForm dict={dict.admin.login} />
    </main>
  );
}
