import { NextResponse } from 'next/server'
import { monthDays } from '@/lib/availability'
import { getExp } from '@/lib/data'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug') ?? ''
  const month = searchParams.get('month') ?? ''
  if (!getExp(slug) || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 })
  }
  // Simula latencia de red para que se vea el estado de carga
  await new Promise((r) => setTimeout(r, 250))
  return NextResponse.json({ days: monthDays(slug, month) })
}
