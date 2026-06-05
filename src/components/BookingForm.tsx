"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { Messages } from "@/i18n/messages";

interface ServiceOption {
  id: string;
  name: string;
  duration: number;
  price: number;
}

interface BarberOption {
  id: string;
  name: string;
}

interface BookingFormProps {
  dict: Messages;
  services: ServiceOption[];
  barbers: BarberOption[];
}

/** A confirmed booking as returned by POST /api/bookings. */
interface ConfirmedBooking {
  id: string;
  service: string;
  serviceName: string;
  barber: string;
  barberName: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  status: string;
  createdAt: string;
}

interface AvailabilityResponse {
  slots: string[];
}

interface BookingResponse {
  booking?: ConfirmedBooking;
  error?: string;
}

const ANY_BARBER_ID = "any";

/** Local YYYY-MM-DD (not UTC) so the date picker matches the user's day. */
function localToday(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const fieldLabel = "font-display text-[11px] uppercase tracking-[0.2em] text-cream/70";
const fieldInput =
  "w-full border-b border-cream/25 bg-transparent py-3 text-cream outline-none placeholder:text-cream/30 focus:border-cream";
const primaryButton =
  "border border-cream/50 px-6 py-3 font-display text-[11px] uppercase tracking-[0.22em] transition-colors hover:bg-cream hover:text-background";

export function BookingForm({ dict, services, barbers }: BookingFormProps) {
  const today = localToday();

  const [service, setService] = useState("");
  const [barber, setBarber] = useState(ANY_BARBER_ID);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<ConfirmedBooking | null>(null);

  useEffect(() => {
    if (!service || !date) {
      setSlots([]);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    async function loadSlots() {
      setLoadingSlots(true);
      try {
        const params = new URLSearchParams({ date, barber });
        const res = await fetch(`/api/availability?${params.toString()}`, {
          signal: controller.signal,
        });
        const json = (await res.json()) as AvailabilityResponse;
        if (cancelled) return;
        const nextSlots = Array.isArray(json.slots) ? json.slots : [];
        setSlots(nextSlots);
        setTime((current) => (current && !nextSlots.includes(current) ? "" : current));
      } catch {
        if (!cancelled) {
          setSlots([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingSlots(false);
        }
      }
    }

    void loadSlots();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [service, date, barber]);

  const canSubmit =
    service !== "" &&
    barber !== "" &&
    date !== "" &&
    time !== "" &&
    name.trim() !== "" &&
    email.trim() !== "" &&
    phone.trim() !== "";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service,
          barber,
          date,
          time,
          name,
          email,
          phone,
          notes: notes.trim() === "" ? undefined : notes,
        }),
      });
      const json = (await res.json()) as BookingResponse;
      if (res.ok && json.booking) {
        setConfirmed(json.booking);
      } else {
        setError(json.error ?? dict.book.genericError);
      }
    } catch {
      setError(dict.book.genericError);
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setService("");
    setBarber(ANY_BARBER_ID);
    setDate("");
    setTime("");
    setName("");
    setEmail("");
    setPhone("");
    setNotes("");
    setSlots([]);
    setLoadingSlots(false);
    setSubmitting(false);
    setError(null);
    setConfirmed(null);
  }

  if (confirmed) {
    return (
      <div className="border border-cream/50 p-8">
        <h2 className="font-display text-2xl font-black uppercase tracking-[0.12em] text-cream">
          {dict.book.received}
        </h2>
        <dl className="mt-6 space-y-3">
          <ConfirmationRow label={dict.book.service} value={confirmed.serviceName} />
          <ConfirmationRow label={dict.book.barber} value={confirmed.barberName} />
          <ConfirmationRow label={dict.book.date} value={confirmed.date} />
          <ConfirmationRow label={dict.book.time} value={confirmed.time} />
          <ConfirmationRow label={dict.book.name} value={confirmed.name} />
        </dl>
        <button type="button" onClick={reset} className={cn(primaryButton, "mt-8")}>
          {dict.book.bookAnother}
        </button>
      </div>
    );
  }

  const timeNotReady = !service || !date;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-2">
        <label htmlFor="service" className={fieldLabel}>
          {dict.book.service}
        </label>
        <select
          id="service"
          value={service}
          onChange={(e) => setService(e.target.value)}
          className={fieldInput}
        >
          <option value="" className="text-black">
            {dict.book.selectService}
          </option>
          {services.map((s) => (
            <option key={s.id} value={s.id} className="text-black">
              {`${s.name} · ${s.duration} ${dict.book.minutes} · €${s.price}`}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="barber" className={fieldLabel}>
          {dict.book.barber}
        </label>
        <select
          id="barber"
          value={barber}
          onChange={(e) => setBarber(e.target.value)}
          className={fieldInput}
        >
          <option value={ANY_BARBER_ID} className="text-black">
            {dict.book.anyBarber}
          </option>
          {barbers.map((b) => (
            <option key={b.id} value={b.id} className="text-black">
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="date" className={fieldLabel}>
          {dict.book.date}
        </label>
        <input
          id="date"
          type="date"
          min={today}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={cn(fieldInput, "[color-scheme:dark]")}
        />
      </div>

      <div className="space-y-3">
        <span className={fieldLabel}>{dict.book.time}</span>
        {timeNotReady ? (
          <p className="text-sm text-cream/40">{dict.book.pickFirst}</p>
        ) : loadingSlots ? (
          <p className="text-sm text-cream/40">{dict.book.loading}</p>
        ) : slots.length === 0 ? (
          <p className="text-sm text-cream/40">{dict.book.noSlots}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {slots.map((slot) => {
              const selected = slot === time;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTime(slot)}
                  className={cn(
                    "border px-4 py-2 font-display text-xs uppercase tracking-[0.15em] transition-colors",
                    selected
                      ? "border-cream bg-cream text-background"
                      : "border-cream/25 text-cream/70 hover:border-cream",
                  )}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="name" className={fieldLabel}>
          {dict.book.name}
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={dict.book.namePlaceholder}
          className={fieldInput}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className={fieldLabel}>
          {dict.book.email}
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={dict.book.emailPlaceholder}
          className={fieldInput}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className={fieldLabel}>
          {dict.book.phone}
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={dict.book.phonePlaceholder}
          className={fieldInput}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className={fieldLabel}>
          {dict.book.notes}
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder={dict.book.notesPlaceholder}
          className={cn(fieldInput, "resize-none")}
        />
      </div>

      {error ? (
        <p className="font-display text-[11px] uppercase tracking-[0.2em] text-red-400">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={!canSubmit || submitting}
        className={cn(primaryButton, (!canSubmit || submitting) && "opacity-40 pointer-events-none")}
      >
        {submitting ? dict.book.confirming : dict.book.confirm}
      </button>
    </form>
  );
}

function ConfirmationRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-cream/15 pb-2">
      <dt className="font-display text-[11px] uppercase tracking-[0.2em] text-cream/60">
        {label}
      </dt>
      <dd className="text-right text-cream">{value}</dd>
    </div>
  );
}
