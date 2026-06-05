"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { Booking, BookingStatus } from "@/types/booking";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | BookingStatus;

interface AdminDashboardProps {
  initial: Booking[];
}

const STATUS_FILTERS: StatusFilter[] = [
  "all",
  "pending",
  "confirmed",
  "cancelled",
];

function statusPillClass(status: BookingStatus): string {
  switch (status) {
    case "confirmed":
      return "";
    case "cancelled":
      return "line-through";
    case "pending":
    default:
      return "text-cream/70";
  }
}

function statusPillColor(status: BookingStatus): string | undefined {
  switch (status) {
    case "confirmed":
      return "#7dd3a0";
    case "cancelled":
      return "#e08a8a";
    default:
      return undefined;
  }
}

export function AdminDashboard({ initial }: AdminDashboardProps) {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>(initial);
  const [filterDate, setFilterDate] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<StatusFilter>("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  const visible = useMemo<Booking[]>(() => {
    return bookings
      .filter((b) => (filterDate ? b.date === filterDate : true))
      .filter((b) => (filterStatus === "all" ? true : b.status === filterStatus))
      .slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [bookings, filterDate, filterStatus]);

  async function refresh(): Promise<void> {
    try {
      const res = await fetch("/api/admin/bookings", { cache: "no-store" });
      if (!res.ok) return;
      const data: { bookings?: Booking[] } = await res.json();
      if (Array.isArray(data.bookings)) {
        setBookings(data.bookings);
      }
    } catch {
      // swallow — keep current state on transient failure
    }
  }

  async function setStatus(id: string, status: BookingStatus): Promise<void> {
    setBusyId(id);
    try {
      await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      await refresh();
    } catch {
      // ignore
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string): Promise<void> {
    setBusyId(id);
    try {
      await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
      await refresh();
    } catch {
      // ignore
    } finally {
      setBusyId(null);
    }
  }

  async function logout(): Promise<void> {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // ignore
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-cream sm:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-cream/15 pb-6">
          <span className="font-display text-sm uppercase tracking-[0.2em] text-cream">
            Barberia · Admin
          </span>
          <button
            type="button"
            onClick={logout}
            className="border border-cream/50 px-4 py-2 font-display text-[11px] uppercase tracking-[0.22em] transition-colors hover:bg-cream hover:text-background"
          >
            Logout
          </button>
        </header>

        {/* Filters */}
        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end">
          <div className="flex flex-col">
            <label
              htmlFor="filter-date"
              className="font-display text-[11px] uppercase tracking-[0.2em] text-cream/70"
            >
              Date
            </label>
            <div className="mt-2 flex items-center gap-4">
              <input
                id="filter-date"
                type="date"
                value={filterDate}
                onChange={(event) => setFilterDate(event.target.value)}
                className="border-b border-cream/25 bg-transparent py-3 text-cream outline-none [color-scheme:dark] focus:border-cream"
              />
              {filterDate ? (
                <button
                  type="button"
                  onClick={() => setFilterDate("")}
                  className="font-display text-[11px] uppercase tracking-[0.2em] text-cream/50 transition-colors hover:text-cream"
                >
                  Clear
                </button>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="filter-status"
              className="font-display text-[11px] uppercase tracking-[0.2em] text-cream/70"
            >
              Status
            </label>
            <select
              id="filter-status"
              value={filterStatus}
              onChange={(event) =>
                setFilterStatus(event.target.value as StatusFilter)
              }
              className="mt-2 w-full border-b border-cream/25 bg-transparent py-3 text-cream outline-none focus:border-cream sm:w-56"
            >
              {STATUS_FILTERS.map((value) => (
                <option key={value} value={value} className="text-black">
                  {value === "all" ? "All" : value}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bookings */}
        {visible.length === 0 ? (
          <p className="mt-16 font-display text-sm uppercase tracking-[0.2em] text-cream/40">
            No bookings yet.
          </p>
        ) : (
          <>
            {/* Column headers (desktop only) */}
            <div className="mt-10 hidden grid-cols-[6rem_4rem_1fr_1fr_1.4fr_7rem_auto] gap-4 border-b border-cream/15 pb-3 font-display text-[11px] uppercase tracking-[0.18em] text-cream/50 lg:grid">
              <span>Date</span>
              <span>Time</span>
              <span>Service</span>
              <span>Barber</span>
              <span>Client</span>
              <span>Status</span>
              <span className="text-right">Actions</span>
            </div>

            <ul className="mt-4 flex flex-col gap-4 lg:gap-0">
              {visible.map((b) => (
                <li
                  key={b.id}
                  className="grid grid-cols-1 gap-3 border border-cream/15 p-5 lg:grid-cols-[6rem_4rem_1fr_1fr_1.4fr_7rem_auto] lg:items-center lg:gap-4 lg:border-x-0 lg:border-t-0 lg:border-b lg:p-0 lg:py-5"
                >
                  <div className="font-sans text-sm text-cream">
                    <span className="font-display text-[11px] uppercase tracking-[0.18em] text-cream/40 lg:hidden">
                      Date{" "}
                    </span>
                    {b.date}
                  </div>

                  <div className="font-sans text-sm text-cream">
                    <span className="font-display text-[11px] uppercase tracking-[0.18em] text-cream/40 lg:hidden">
                      Time{" "}
                    </span>
                    {b.time}
                  </div>

                  <div className="font-sans text-sm text-cream">
                    <span className="font-display text-[11px] uppercase tracking-[0.18em] text-cream/40 lg:hidden">
                      Service{" "}
                    </span>
                    {b.serviceName}
                  </div>

                  <div className="font-sans text-sm text-cream">
                    <span className="font-display text-[11px] uppercase tracking-[0.18em] text-cream/40 lg:hidden">
                      Barber{" "}
                    </span>
                    {b.barberName}
                  </div>

                  <div className="font-sans text-sm leading-relaxed">
                    <div className="text-cream">{b.name}</div>
                    <div className="text-xs text-cream/50">{b.phone}</div>
                    <div className="text-xs text-cream/50">{b.email}</div>
                  </div>

                  <div>
                    <span
                      className={cn(
                        "font-display text-xs uppercase tracking-[0.15em]",
                        statusPillClass(b.status),
                      )}
                      style={{ color: statusPillColor(b.status) }}
                    >
                      {b.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    <button
                      type="button"
                      onClick={() => setStatus(b.id, "confirmed")}
                      disabled={busyId === b.id}
                      className={cn(
                        "border border-cream/40 px-3 py-1.5 font-display text-[10px] uppercase tracking-[0.15em] transition-colors hover:bg-cream hover:text-background",
                        busyId === b.id && "opacity-40 pointer-events-none",
                      )}
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus(b.id, "cancelled")}
                      disabled={busyId === b.id}
                      className={cn(
                        "border border-cream/40 px-3 py-1.5 font-display text-[10px] uppercase tracking-[0.15em] transition-colors hover:bg-cream hover:text-background",
                        busyId === b.id && "opacity-40 pointer-events-none",
                      )}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(b.id)}
                      disabled={busyId === b.id}
                      className={cn(
                        "border border-cream/40 px-3 py-1.5 font-display text-[10px] uppercase tracking-[0.15em] transition-colors hover:bg-cream hover:text-background",
                        busyId === b.id && "opacity-40 pointer-events-none",
                      )}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </main>
  );
}
