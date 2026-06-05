import { getAdminLocale } from "@/lib/admin-locale";
import { getDictionary } from "@/i18n/dictionaries";
import { listBookings } from "@/lib/bookings";
import { CalendarView } from "@/components/admin/CalendarView";

export const dynamic = "force-dynamic";

export default async function AdminCalendarPage() {
  const dict = getDictionary(await getAdminLocale());
  const bookings = await listBookings();
  return <CalendarView bookings={bookings} dict={dict} />;
}
