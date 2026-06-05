import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { listProducts, createProduct } from '@/lib/products'
import type { ProductInput } from '@/types/product'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json({ products: await listProducts() })
}

export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Partial<ProductInput>
  try {
    body = (await req.json()) as Partial<ProductInput>
  } catch {
    body = {}
  }

  const result = await createProduct(body as ProductInput)
  if (result.ok) {
    return NextResponse.json({ product: result.product }, { status: 201 })
  }
  return NextResponse.json({ error: result.error }, { status: 400 })
}
