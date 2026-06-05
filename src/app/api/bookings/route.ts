import { NextResponse } from "next/server";
import { createBooking } from "@/lib/bookings";
import type { BookingInput } from "@/types/booking";

export async function POST(req: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const result = await createBooking(body as BookingInput);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ booking: result.booking }, { status: 201 });
}
