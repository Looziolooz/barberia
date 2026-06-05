"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Messages } from "@/i18n/messages";

export function LoginForm({ dict }: { dict: Messages["admin"]["login"] }) {
  const router = useRouter();
  const [password, setPassword] = useState("barberia");
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
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <h1 className="font-display text-3xl uppercase tracking-[0.2em] text-cream">
        {dict.title}
      </h1>

      <div className="mt-10">
        <label
          htmlFor="password"
          className="font-display text-[11px] uppercase tracking-[0.2em] text-cream/70"
        >
          {dict.password}
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full border-b border-cream/25 bg-transparent py-3 text-cream outline-none placeholder:text-cream/30 focus:border-cream"
          placeholder={dict.placeholder}
        />
      </div>

      {error ? (
        <p className="mt-4 text-sm" style={{ color: "#e08a8a" }}>
          {dict.wrong}
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
        {dict.enter}
      </button>

      <p className="mt-6 border border-dashed border-cream/20 px-4 py-3 text-center font-display text-[11px] uppercase tracking-[0.18em] text-cream/45">
        {dict.demo}
      </p>
    </form>
  );
}
