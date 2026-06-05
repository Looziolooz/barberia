import { NextResponse } from "next/server";
import { passwordMatches, startSession } from "@/lib/auth";

export async function POST(req: Request): Promise<NextResponse> {
  let password: unknown;
  try {
    const body = (await req.json()) as { password?: unknown };
    password = body.password;
  } catch {
    password = undefined;
  }

  if (!passwordMatches(password)) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  await startSession();
  return NextResponse.json({ ok: true });
}
