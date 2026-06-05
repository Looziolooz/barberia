// Minimal admin auth: a shared password (env ADMIN_PASSWORD, default "barberia")
// exchanged for an httpOnly session cookie. Good enough for a single-owner demo;
// swap for real auth before production.
import { cookies } from "next/headers";

const PASSWORD = process.env.ADMIN_PASSWORD || "barberia";
const TOKEN = process.env.ADMIN_TOKEN || "barberia-session-2026";
const COOKIE = "barberia_admin";

export function passwordMatches(p: unknown): boolean {
  return typeof p === "string" && p.length > 0 && p === PASSWORD;
}

export async function startSession(): Promise<void> {
  (await cookies()).set(COOKIE, TOKEN, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function endSession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  return (await cookies()).get(COOKIE)?.value === TOKEN;
}
