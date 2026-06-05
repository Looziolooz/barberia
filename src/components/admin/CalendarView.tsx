"use client";

import { useMemo, useState } from "react";
import type { Booking, BookingStatus } from "@/types/booking";
import type { Messages } from "@/i18n/messages";

const STATUS_COLOR: Record<BookingStatus, string> = {
  confirmed: "#7dd3a0",
  cancelled: "#e08a8a",
  pending: "#e0c07d",
};

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function dateKey(year: number, month: number, day: number): string {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

export function CalendarView({
  bookings,
  dict,
}: {
  bookings: Booking[];
  dict: Messages;
}) {
  const cal = dict.admin.calendar;

  const [view, setView] = useState<{ year: number; month: number }>(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [selected, setSelected] = useState<string | null>(null);

  const today = useMemo(() => {
    const now = new Date();
    return dateKey(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const byDate = useMemo(() => {
    const map = new Map<string, Booking[]>();
    for (const booking of bookings) {
      const list = map.get(booking.date);
      if (list) {
        list.push(booking);
      } else {
        map.set(booking.date, [booking]);
      }
    }
    for (const list of map.values()) {
      list.sort((a, b) => a.time.localeCompare(b.time));
    }
    return map;
  }, [bookings]);

  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  // getDay(): Sunday=0..Saturday=6 -> Monday-first index 0..6
  const firstWeekday = (new Date(view.year, view.month, 1).getDay() + 6) % 7;

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstWeekday; i += 1) {
    cells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(day);
  }

  function goPrev() {
    setView((prev) =>
      prev.month === 0
        ? { year: prev.year - 1, month: 11 }
        : { year: prev.year, month: prev.month - 1 },
    );
  }

  function goNext() {
    setView((prev) =>
      prev.month === 11
        ? { year: prev.year + 1, month: 0 }
        : { year: prev.year, month: prev.month + 1 },
    );
  }

  function goToday() {
    const now = new Date();
    setView({ year: now.getFullYear(), month: now.getMonth() });
  }

  const selectedBookings = selected ? byDate.get(selected) ?? [] : [];

  return (
    <div className="bg-background text-cream">
      <h1 className="font-display text-[11px] uppercase tracking-[0.2em] text-cream/70">
        {cal.title}
      </h1>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={goPrev}
            aria-label={cal.prev}
            className="border border-cream/50 px-3 py-1.5 font-display text-[10px] uppercase tracking-[0.22em] transition-colors hover:bg-cream hover:text-background"
          >
            &#8592;
          </button>
          <span className="font-display text-[11px] uppercase tracking-[0.2em] text-cream/70">
            {cal.months[view.month]} {view.year}
          </span>
          <button
            type="button"
            onClick={goNext}
            aria-label={cal.next}
            className="border border-cream/50 px-3 py-1.5 font-display text-[10px] uppercase tracking-[0.22em] transition-colors hover:bg-cream hover:text-background"
          >
            &#8594;
          </button>
        </div>
        <button
          type="button"
          onClick={goToday}
          className="border border-cream/50 px-4 py-2 font-display text-[11px] uppercase tracking-[0.22em] transition-colors hover:bg-cream hover:text-background"
        >
          {cal.today}
        </button>
      </div>

      <div className="mt-6 grid grid-cols-7">
        {cal.weekdays.map((label) => (
          <div
            key={label}
            className="border border-cream/12 p-2 text-center font-display text-[10px] uppercase tracking-[0.2em] text-cream/70"
          >
            {label}
          </div>
        ))}

        {cells.map((day, index) => {
          if (day === null) {
            return (
              <div
                key={`blank-${index}`}
                className="min-h-[5rem] border border-cream/12 p-2"
              />
            );
          }

          const key = dateKey(view.year, view.month, day);
          const dayBookings = byDate.get(key) ?? [];
          const isToday = key === today;
          const isSelected = key === selected;

          return (
            <button
              type="button"
              key={key}
              onClick={() => setSelected(key)}
              className={`min-h-[5rem] border p-2 text-left align-top transition-colors ${
                isToday ? "border-cream text-cream" : "border-cream/12 text-cream/80"
              } ${isSelected ? "bg-cream/5" : "hover:bg-cream/5"}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-[11px] tracking-[0.1em]">
                  {day}
                </span>
                {dayBookings.length > 0 ? (
                  <span className="border border-cream/30 px-1.5 font-display text-[9px] tracking-[0.1em] text-cream/70">
                    {dayBookings.length}
                  </span>
                ) : null}
              </div>
              <div className="mt-1 space-y-0.5">
                {dayBookings.slice(0, 2).map((booking) => (
                  <div
                    key={booking.id}
                    className="truncate text-[10px] text-cream/60"
                  >
                    {booking.time} {booking.name}
                  </div>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {selected ? (
        <div className="mt-8">
          {selectedBookings.length > 0 ? (
            <ul className="divide-y divide-cream/15 border border-cream/15">
              {selectedBookings.map((booking) => (
                <li
                  key={booking.id}
                  className="flex flex-wrap items-center gap-x-4 gap-y-1 p-4"
                >
                  <span className="font-display text-[11px] tracking-[0.1em] text-cream">
                    {booking.time}
                  </span>
                  <span className="text-sm text-cream/80">
                    {booking.serviceName}
                  </span>
                  <span className="text-sm text-cream/60">
                    {booking.barberName}
                  </span>
                  <span className="text-sm text-cream/80">{booking.name}</span>
                  <span
                    className="ml-auto font-display text-[10px] uppercase tracking-[0.2em]"
                    style={{ color: STATUS_COLOR[booking.status] }}
                  >
                    {dict.admin.status[booking.status]}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-display text-[11px] uppercase tracking-[0.2em] text-cream/70">
              {cal.none}
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
