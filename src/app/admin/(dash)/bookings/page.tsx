import { getAdminLocale } from "@/lib/admin-locale";
import { getDictionary } from "@/i18n/dictionaries";
import { listBookings } from "@/lib/bookings";
import { BookingsTable } from "@/components/admin/BookingsTable";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const dict = getDictionary(await getAdminLocale());
  const bookings = await listBookings();
  return <BookingsTable initial={bookings} dict={dict} />;
}
