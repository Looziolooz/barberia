import { NextResponse } from "next/server";
import { getAvailability } from "@/lib/bookings";

export const dynamic = "force-dynamic";

export async function GET(req: Request): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const barber = searchParams.get("barber") ?? "any";

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ slots: [] });
  }

  return NextResponse.json({ slots: await getAvailability(date, barber) });
}
