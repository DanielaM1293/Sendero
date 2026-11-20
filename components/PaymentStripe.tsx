'use client'

import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import type { Stripe } from '@stripe/stripe-js'
import { loadStripe } from '@stripe/stripe-js/pure'
import { Lock } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useMemo, useState } from 'react'
import { useStore } from '@/lib/store'

const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
let cached: Promise<Stripe | null> | null = null
// Carga diferida: js.stripe.com solo se pide cuando de verdad se usa el pago
const getStripe = () => (pk ? (cached ??= loadStripe(pk)) : null)

function Form({ label, busy, error, onPaid, onError, email }: { label: string; busy: boolean; error: string | null; onPaid: (id: string) => void; onError: (m: string) => void; email: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const { t } = useStore()
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    const res = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
      confirmParams: { return_url: `${window.location.origin}/confirmacion`, receipt_email: email },
    })
    if (res.error) {
      onError(res.error.type === 'card_error' ? res.error.message ?? t('err.declined') : t('err.generic'))
      setLoading(false)
      return
    }
    onPaid(res.paymentIntent.id)
  }

  const working = busy || loading
  return (
    <form onSubmit={submit} className="space-y-5">
      <PaymentElement options={{ layout: 'tabs' }} />
      {error && (
        <p role="alert" className="rounded-2xl bg-brand/10 px-4 py-3 text-sm font-semibold text-brand">
          {error}
        </p>
      )}
      <button disabled={!stripe || working} className="btn-primary w-full !py-4 text-base">
        {working ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-onbrand/40 border-t-onbrand" /> {t('co.paying')}
          </>
        ) : (
          <>
            <Lock size={16} /> {label}
          </>
        )}
      </button>
      <p className="text-center text-xs text-muted">{t('co.secure')}</p>
    </form>
  )
}

export function PaymentStripe(props: { clientSecret: string; label: string; busy: boolean; error: string | null; onPaid: (id: string) => void; onError: (m: string) => void; email: string }) {
  const { resolvedTheme } = useTheme()
  const { lang } = useStore()
  const dark = resolvedTheme === 'dark'
  const appearance = useMemo(
    () => ({
      theme: dark ? ('night' as const) : ('stripe' as const),
      variables: {
        colorPrimary: dark ? '#ff6b8f' : '#d02456',
        colorBackground: dark ? '#0f2023' : '#f6faf7',
        colorText: dark ? '#e7f1ec' : '#0e2428',
        fontFamily: 'Instrument Sans Variable, system-ui, sans-serif',
        borderRadius: '16px',
      },
    }),
    [dark]
  )
  const stripePromise = getStripe()
  if (!stripePromise) return null
  return (
    <Elements key={`${dark}`} stripe={stripePromise} options={{ clientSecret: props.clientSecret, appearance, locale: lang }}>
      <Form {...props} />
    </Elements>
  )
}
