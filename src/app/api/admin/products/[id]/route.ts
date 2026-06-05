import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { updateProduct, deleteProduct } from '@/lib/products'
import type { ProductInput } from '@/types/product'

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(req: Request, ctx: RouteContext) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await ctx.params

  let body: Partial<ProductInput>
  try {
    body = (await req.json()) as Partial<ProductInput>
  } catch {
    body = {}
  }

  const product = await updateProduct(id, body)
  if (!product) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ product })
}

export async function DELETE(_req: Request, ctx: RouteContext) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await ctx.params

  const ok = await deleteProduct(id)
  if (!ok) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
