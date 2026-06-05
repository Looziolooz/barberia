"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(false);
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data: { ok?: boolean } = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        router.push("/admin");
        router.refresh();
        return;
      }
      setError(true);
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <h1 className="font-display text-3xl uppercase tracking-[0.2em] text-cream">
          Admin
        </h1>

        <div className="mt-10">
          <label
            htmlFor="password"
            className="font-display text-[11px] uppercase tracking-[0.2em] text-cream/70"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full border-b border-cream/25 bg-transparent py-3 text-cream outline-none placeholder:text-cream/30 focus:border-cream"
            placeholder="••••••••"
          />
        </div>

        {error ? (
          <p className="mt-4 text-sm" style={{ color: "#e08a8a" }}>
            Wrong password
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className={
            "mt-10 w-full border border-cream/50 px-6 py-3 font-display text-[11px] uppercase tracking-[0.22em] transition-colors hover:bg-cream hover:text-background" +
            (submitting ? " opacity-40 pointer-events-none" : "")
          }
        >
          Enter
        </button>
      </form>
    </main>
  );
}
