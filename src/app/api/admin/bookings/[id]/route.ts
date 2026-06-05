import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { setStatus, deleteBooking } from "@/lib/bookings";
import type { BookingStatus } from "@/types/booking";

type RouteContext = { params: Promise<{ id: string }> };

const VALID_STATUSES: readonly BookingStatus[] = ["pending", "confirmed", "cancelled"];

function isBookingStatus(value: unknown): value is BookingStatus {
  return typeof value === "string" && (VALID_STATUSES as readonly string[]).includes(value);
}

export async function PATCH(req: Request, ctx: RouteContext): Promise<NextResponse> {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;

  let status: unknown;
  try {
    const body = (await req.json()) as { status?: unknown };
    status = body.status;
  } catch {
    status = undefined;
  }

  if (!isBookingStatus(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const booking = await setStatus(id, status);
  if (!booking) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ booking });
}

export async function DELETE(req: Request, ctx: RouteContext): Promise<NextResponse> {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;

  const ok = await deleteBooking(id);
  if (!ok) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
