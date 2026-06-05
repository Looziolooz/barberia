import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { isLocale } from '@/i18n/config'
import { ADMIN_LANG_COOKIE } from '@/lib/admin-locale'

export async function POST(req: Request) {
  let body: { locale?: string } = {}
  try {
    body = (await req.json()) as { locale?: string }
  } catch {
    body = {}
  }

  if (typeof body.locale !== 'string' || !isLocale(body.locale)) {
    return NextResponse.json({ error: 'Invalid locale' }, { status: 400 })
  }

  ;(await cookies()).set(ADMIN_LANG_COOKIE, body.locale, {
    httpOnly: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  })

  return NextResponse.json({ ok: true })
}
