import { NextResponse } from 'next/server'
import { quote, stripe } from '@/lib/server'

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'bad_request' }, { status: 400 })

  const q = quote(body.items, body.promo)
  if ('error' in q) return NextResponse.json({ error: q.error }, { status: q.error === 'availability' ? 409 : 400 })
  if (q.total <= 0) return NextResponse.json({ error: 'invalid' }, { status: 400 })

  // Sin claves de Stripe: modo demostración
  if (!stripe) return NextResponse.json({ demo: true, amount: q.total })

  try {
    const intent = await stripe.paymentIntents.create({
      amount: q.total, // centavos de USD
      currency: process.env.STRIPE_CURRENCY || 'usd',
      automatic_payment_methods: { enabled: true },
      receipt_email: typeof body.email === 'string' ? body.email : undefined,
      description: 'Reserva Sendero',
      metadata: {
        items: JSON.stringify(q.items.map((i) => `${i.slug}@${i.date}x${i.guests}`)).slice(0, 480),
        promo: q.promo ?? '',
      },
    })
    return NextResponse.json({ demo: false, clientSecret: intent.client_secret, id: intent.id, amount: q.total })
  } catch (e) {
    console.error('stripe intent error', e)
    return NextResponse.json({ error: 'stripe' }, { status: 502 })
  }
}
