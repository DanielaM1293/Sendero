import { NextResponse } from 'next/server'
import { newRef, orders, quote, stripe } from '@/lib/server'

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  if (!body?.customer?.email || !body?.customer?.name) return NextResponse.json({ error: 'bad_request' }, { status: 400 })

  const q = quote(body.items, body.promo)
  if ('error' in q) return NextResponse.json({ error: q.error }, { status: q.error === 'availability' ? 409 : 400 })

  let demo = true
  if (stripe) {
    demo = false
    // Verifica el pago directamente con Stripe: nunca confíes en el cliente.
    try {
      const pi = await stripe.paymentIntents.retrieve(String(body.paymentIntentId))
      if (pi.status !== 'succeeded' && pi.status !== 'processing') return NextResponse.json({ error: 'payment' }, { status: 402 })
      if (pi.amount !== q.total) return NextResponse.json({ error: 'amount_mismatch' }, { status: 409 })
    } catch {
      return NextResponse.json({ error: 'payment' }, { status: 402 })
    }
  } else {
    await new Promise((r) => setTimeout(r, 1400))
    if (body.scenario === 'decline') return NextResponse.json({ error: 'declined' }, { status: 402 })
  }

  const ref = newRef()
  const order = {
    ref,
    createdAt: new Date().toISOString(),
    email: String(body.customer.email),
    name: String(body.customer.name),
    items: q.items.map((i, n) => ({ ...i, id: `${ref}-${n}` })),
    subtotal: q.subtotal,
    discount: q.discount,
    total: q.total,
    demo,
    promo: q.promo,
  }
  // TODO: persiste en tu base de datos, descuenta cupos y envía el correo de confirmación.
  orders.set(ref, order)
  return NextResponse.json(order)
}
