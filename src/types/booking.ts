export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface Booking {
  id: string;
  service: string; // service id
  serviceName: string;
  barber: string; // resolved barber id (never "any")
  barberName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  name: string;
  email: string;
  phone: string;
  notes?: string;
  status: BookingStatus;
  createdAt: string; // ISO timestamp
}

export interface BookingInput {
  service: string;
  barber: string; // may be "any"
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
}
