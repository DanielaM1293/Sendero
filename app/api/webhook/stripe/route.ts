import { NextResponse } from 'next/server'
import { stripe } from '@/lib/server'

// Configura en Stripe: https://tu-dominio.com/api/webhook/stripe
// Local: stripe listen --forward-to localhost:3000/api/webhook/stripe
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripe || !secret) return NextResponse.json({ ok: true, skipped: true })

  const sig = req.headers.get('stripe-signature') ?? ''
  const raw = await req.text()
  try {
    const event = stripe.webhooks.constructEvent(raw, sig, secret)
    if (event.type === 'payment_intent.succeeded') {
      // TODO: marca la reserva como pagada y envía el correo.
      console.log('Pago confirmado', event.data.object.id)
    }
    if (event.type === 'payment_intent.payment_failed') {
      console.log('Pago fallido', event.data.object.id)
    }
    return NextResponse.json({ received: true })
  } catch (e) {
    return NextResponse.json({ error: 'invalid_signature' }, { status: 400 })
  }
}
