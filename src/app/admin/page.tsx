import { redirect } from "next/navigation";

import { isAuthenticated } from "@/lib/auth";
import { listBookings } from "@/lib/bookings";
import { AdminDashboard } from "@/components/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  const bookings = await listBookings();
  return <AdminDashboard initial={bookings} />;
}
