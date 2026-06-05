// File-backed booking store (server-only). Persists to data/bookings.json.
// Swap this module for a real DB later without touching the API/UI.
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { Booking, BookingInput, BookingStatus } from "@/types/booking";
import { BARBERS, allSlots, serviceById, barberById } from "@/content/booking";

const FILE = path.join(process.cwd(), "data", "bookings.json");

async function readAll(): Promise<Booking[]> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    return JSON.parse(raw) as Booking[];
  } catch {
    return [];
  }
}
async function writeAll(list: Booking[]): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(list, null, 2), "utf8");
}

export async function listBookings(): Promise<Booking[]> {
  const list = await readAll();
  return list.sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
}

/** Available "HH:MM" slots for a date and barber selection ("any" allowed). */
export async function getAvailability(date: string, barber: string): Promise<string[]> {
  const active = (await readAll()).filter((b) => b.date === date && b.status !== "cancelled");
  const slots = allSlots();
  if (barber === "any") {
    return slots.filter((t) => {
      const busy = new Set(active.filter((b) => b.time === t).map((b) => b.barber));
      return busy.size < BARBERS.length; // at least one barber free
    });
  }
  const taken = new Set(active.filter((b) => b.barber === barber).map((b) => b.time));
  return slots.filter((t) => !taken.has(t));
}

function firstFreeBarber(active: Booking[], date: string, time: string): string | null {
  const busy = new Set(active.filter((b) => b.date === date && b.time === time).map((b) => b.barber));
  const free = BARBERS.find((b) => !busy.has(b.id));
  return free ? free.id : null;
}

export type CreateResult = { ok: true; booking: Booking } | { ok: false; error: string };

export async function createBooking(input: BookingInput): Promise<CreateResult> {
  const svc = serviceById(input.service);
  if (!svc) return { ok: false, error: "Please choose a valid service." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date || "")) return { ok: false, error: "Please choose a valid date." };
  if (!allSlots().includes(input.time)) return { ok: false, error: "Please choose a valid time." };
  if (!input.name?.trim()) return { ok: false, error: "Your name is required." };
  if (!/^\+?[\d\s().-]{6,}$/.test(input.phone || "")) return { ok: false, error: "A valid phone number is required." };
  if (!/^\S+@\S+\.\S+$/.test(input.email || "")) return { ok: false, error: "A valid email is required." };

  const list = await readAll();
  const active = list.filter((b) => b.status !== "cancelled");
  let barberId = input.barber;
  if (barberId === "any" || !barberById(barberId)) {
    const free = firstFreeBarber(active, input.date, input.time);
    if (!free) return { ok: false, error: "No barber is available at that time. Please pick another slot." };
    barberId = free;
  } else {
    const clash = active.some((b) => b.date === input.date && b.time === input.time && b.barber === barberId);
    if (clash) return { ok: false, error: "That slot is already booked. Please pick another time." };
  }
  const barber = barberById(barberId)!;
  const booking: Booking = {
    id: randomUUID(),
    service: svc.id,
    serviceName: svc.name,
    barber: barber.id,
    barberName: barber.name,
    date: input.date,
    time: input.time,
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    notes: input.notes?.trim() || undefined,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  list.push(booking);
  await writeAll(list);
  return { ok: true, booking };
}

export async function setStatus(id: string, status: BookingStatus): Promise<Booking | null> {
  const list = await readAll();
  const b = list.find((x) => x.id === id);
  if (!b) return null;
  b.status = status;
  await writeAll(list);
  return b;
}

export async function deleteBooking(id: string): Promise<boolean> {
  const list = await readAll();
  const next = list.filter((x) => x.id !== id);
  if (next.length === list.length) return false;
  await writeAll(next);
  return true;
}
