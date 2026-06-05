import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { listBookings } from "@/lib/bookings";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ bookings: await listBookings() });
}
