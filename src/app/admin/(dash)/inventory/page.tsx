import { getAdminLocale } from "@/lib/admin-locale";
import { getDictionary } from "@/i18n/dictionaries";
import { listProducts } from "@/lib/products";
import { InventoryManager } from "@/components/admin/InventoryManager";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const dict = getDictionary(await getAdminLocale());
  const products = await listProducts();
  return <InventoryManager initial={products} dict={dict} />;
}
