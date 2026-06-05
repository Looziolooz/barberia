import { redirect } from "next/navigation";
import { defaultLocale } from "@/i18n/config";

// Fallback for the bare root. proxy.ts normally redirects "/" with locale
// detection, but this guarantees "/" always resolves to a real route — e.g. on
// hosts that don't execute the proxy for the root path (avoids a 404 there).
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
