import { getAdminLocale } from "@/lib/admin-locale";
import { getDictionary } from "@/i18n/dictionaries";
import { listProducts } from "@/lib/products";
import { ProductsManager } from "@/components/admin/ProductsManager";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const dict = getDictionary(await getAdminLocale());
  const products = await listProducts();
  return <ProductsManager initial={products} dict={dict} />;
}
