export interface Service {
  id: string;
  name: string;
  duration: number; // minutes
  price: number; // EUR
}
export interface Barber {
  id: string;
  name: string;
}

export const SERVICES: Service[] = [
  { id: "haircut", name: "Haircut", duration: 30, price: 25 },
  { id: "beard", name: "Beard Trim", duration: 20, price: 15 },
  { id: "haircut-beard", name: "Haircut & Beard", duration: 45, price: 35 },
  { id: "shave", name: "Hot Towel Shave", duration: 30, price: 22 },
  { id: "kids", name: "Kids Cut", duration: 20, price: 18 },
];

/** Real barbers. "any" is a virtual selection handled at booking time. */
export const BARBERS: Barber[] = [
  { id: "marco", name: "Marco" },
  { id: "luca", name: "Luca" },
  { id: "dino", name: "Dino" },
];
export const ANY_BARBER: Barber = { id: "any", name: "Any barber" };

export const HOURS = { open: "10:00", close: "20:00", slotMinutes: 30 } as const;

/** All bookable "HH:MM" slots for a day, based on HOURS. */
export function allSlots(): string[] {
  const [oh, om] = HOURS.open.split(":").map(Number);
  const [ch, cm] = HOURS.close.split(":").map(Number);
  const start = oh * 60 + om;
  const end = ch * 60 + cm;
  const out: string[] = [];
  for (let m = start; m < end; m += HOURS.slotMinutes) {
    out.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
  }
  return out;
}

export const serviceById = (id: string): Service | undefined => SERVICES.find((s) => s.id === id);
export const barberById = (id: string): Barber | undefined => BARBERS.find((b) => b.id === id);
