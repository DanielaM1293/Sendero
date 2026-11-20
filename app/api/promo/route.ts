import { NextResponse } from 'next/server'
import { validatePromo } from '@/lib/pricing'

export async function POST(req: Request) {
  const { code, subtotal } = await req.json().catch(() => ({}))
  const res = validatePromo(String(code ?? ''), Number(subtotal) || 0)
  if (!res) return NextResponse.json({ valid: false }, { status: 404 })
  return NextResponse.json({ valid: true, ...res })
}
