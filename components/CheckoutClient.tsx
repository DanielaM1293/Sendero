'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Check, Lock } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { getExp } from '@/lib/data'
import { formatDate } from '@/lib/format'
import { priceItem } from '@/lib/pricing'
import { useStore, type Order } from '@/lib/store'
import { AnimatedMoney } from './AnimatedMoney'
import { PaymentDemo, type DemoSubmit } from './PaymentDemo'
import { PaymentStripe } from './PaymentStripe'
import { Scene } from './Scene'

type Intent = { demo: true } | { demo: false; clientSecret: string; id: string }

export function CheckoutClient() {
  const { t, loc, lang, ready, cart, promo, promoCode, subtotal, discount, total, money, currency, clearCart, setOrder } = useStore()
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [f, setF] = useState({ name: '', email: '', phone: '', notes: '', terms: false })
  const [errs, setErrs] = useState<Record<string, string>>({})
  const [intent, setIntent] = useState<Intent | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const finished = useRef(false)

  const items = cart.map(({ slug, date, guests, addons }) => ({ slug, date, guests, addons }))
  const promoSend = promo?.code

  // Al llegar al paso de pago, el servidor valida el carrito y crea el PaymentIntent
  useEffect(() => {
    if (step !== 2 || cart.length === 0) return
    let alive = true
    setIntent(null)
    setError(null)
    fetch('/api/checkout/intent', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ items, promo: promoSend, email: f.email }) })
      .then(async (r) => {
        const j = await r.json()
        if (!alive) return
        if (!r.ok) return setError(j.error === 'availability' ? t('err.avail') : t('err.generic'))
        setIntent(j.demo ? { demo: true } : { demo: false, clientSecret: j.clientSecret, id: j.id })
      })
      .catch(() => alive && setError(t('err.generic')))
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, JSON.stringify(items), promoSend])

  const validate = () => {
    const e: Record<string, string> = {}
    if (f.name.trim().length < 3) e.name = t('err.required')
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = t('err.email')
    if (f.phone.replace(/\D/g, '').length < 7) e.phone = t('err.phone')
    if (!f.terms) e.terms = t('err.terms')
    setErrs(e)
    return Object.keys(e).length === 0
  }

  const complete = async (extra: { paymentIntentId?: string; scenario?: DemoSubmit['scenario'] }) => {
    setBusy(true)
    setError(null)
    try {
      const r = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ items, promo: promoSend, customer: { name: f.name, email: f.email, phone: f.phone, notes: f.notes }, ...extra }),
      })
      const j = await r.json()
      if (!r.ok) {
        setError(j.error === 'declined' ? t('err.declined') : j.error === 'availability' ? t('err.avail') : t('err.generic'))
        setBusy(false)
        return
      }
      finished.current = true
      setOrder(j as Order)
      clearCart()
      router.push('/confirmacion')
    } catch {
      setError(t('err.generic'))
      setBusy(false)
    }
  }

  if (!ready) return <div className="min-h-[60svh]" />
  if (cart.length === 0 && !finished.current)
    return (
      <div className="grid min-h-[70svh] place-items-center px-6 pt-24 text-center">
        <div>
          <p className="text-lg text-muted">{t('co.emptyCart')}</p>
          <Link href="/experiencias" className="btn-primary mt-6">
            {t('cart.emptyCta')}
          </Link>
        </div>
      </div>
    )

  const label = t('co.pay', { amount: money(total) })
  const Field = ({ id, label, k, type = 'text', auto }: { id: string; label: string; k: 'name' | 'email' | 'phone'; type?: string; auto?: string }) => (
    <div>
      <label htmlFor={id} className="label mb-1.5 block">
        {label}
      </label>
      <input id={id} type={type} autoComplete={auto} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} aria-invalid={!!errs[k]} className={`input ${errs[k] ? '!border-brand' : ''}`} />
      {errs[k] && <p className="mt-1 text-xs text-brand">{errs[k]}</p>}
    </div>
  )

  return (
    <div className="mx-auto max-w-7xl px-4 pb-8 pt-28 sm:px-6">
      <h1 className="h-display text-5xl font-bold sm:text-6xl">{t('co.title')}</h1>

      <ol className="mt-8 flex max-w-md items-center gap-3" aria-label="progress">
        {[t('co.step1'), t('co.step2')].map((s, i) => {
          const n = i + 1
          const done = step > n
          const on = step === n
          return (
            <li key={s} className="flex flex-1 items-center gap-3 last:flex-none">
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold transition ${done ? 'bg-lagoon text-bg' : on ? 'bg-brand text-onbrand' : 'bg-surface2 text-muted'}`}>{done ? <Check size={16} /> : n}</span>
              <span className={`text-sm font-semibold ${on ? '' : 'text-muted'}`}>{s}</span>
              {i === 0 && (
                <span className="h-0.5 flex-1 overflow-hidden rounded bg-ink/10">
                  <motion.span className="block h-full bg-lagoon" initial={false} animate={{ width: step > 1 ? '100%' : '0%' }} transition={{ duration: 0.6 }} />
                </span>
              )}
            </li>
          )
        })}
      </ol>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_26rem]">
        <div className="min-w-0">
          <AnimatePresence mode="wait" initial={false}>
            {step === 1 ? (
              <motion.form
                key="s1"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                noValidate
                onSubmit={(e) => {
                  e.preventDefault()
                  if (validate()) {
                    setStep(2)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }
                }}
                className="space-y-5"
              >
                {Field({ id: 'n', label: t('co.name'), k: 'name', auto: 'name' })}
                <div className="grid gap-5 sm:grid-cols-2">
                  {Field({ id: 'e', label: t('co.email'), k: 'email', type: 'email', auto: 'email' })}
                  {Field({ id: 'p', label: t('co.phone'), k: 'phone', type: 'tel', auto: 'tel' })}
                </div>
                <div>
                  <label htmlFor="no" className="label mb-1.5 block">
                    {t('co.notes')}
                  </label>
                  <textarea id="no" rows={3} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} placeholder={t('co.notesPh')} className="input resize-none" />
                </div>
                <label className="flex cursor-pointer items-start gap-3 text-sm">
                  <input type="checkbox" checked={f.terms} onChange={(e) => setF({ ...f, terms: e.target.checked })} className="mt-0.5 h-5 w-5 shrink-0 accent-[rgb(var(--brand))]" />
                  <span>
                    {t('co.terms')}
                    {errs.terms && <span className="block text-xs text-brand">{errs.terms}</span>}
                  </span>
                </label>
                <button className="btn-primary !py-4 text-base">{t('co.continue')}</button>
              </motion.form>
            ) : (
              <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.3 }}>
                <div className="mb-6 flex items-center justify-between rounded-2xl border border-ink/10 bg-surface px-4 py-3 text-sm">
                  <span>
                    <span className="block text-xs text-muted">{t('co.contact')}</span>
                    <span className="font-semibold">{f.name}</span> <span className="text-muted">{f.email}</span>
                  </span>
                  <button onClick={() => setStep(1)} className="font-semibold text-brand underline underline-offset-4">
                    {t('co.edit')}
                  </button>
                </div>
                {currency === 'COP' && <p className="mb-4 text-xs text-muted">{t('co.copNote')}</p>}
                {!intent && !error && (
                  <div className="flex items-center gap-3 py-10 text-muted">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-ink/20 border-t-brand" /> {t('co.preparing')}
                  </div>
                )}
                {!intent && error && (
                  <p role="alert" className="rounded-2xl bg-brand/10 px-4 py-3 text-sm font-semibold text-brand">
                    {error}
                  </p>
                )}
                {intent?.demo && <PaymentDemo label={label} busy={busy} error={error} defaultName={f.name} onSubmit={(d) => complete({ scenario: d.scenario })} />}
                {intent && !intent.demo && <PaymentStripe clientSecret={intent.clientSecret} label={label} busy={busy} error={error} email={f.email} onError={setError} onPaid={(id) => complete({ paymentIntentId: id })} />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="leaf-sm bg-surface p-5 ring-1 ring-ink/10 sm:p-6">
            <h2 className="font-display text-xl font-bold">{t('co.summary')}</h2>
            <ul className="mt-4 space-y-4">
              {cart.map((it) => {
                const exp = getExp(it.slug)!
                const p = priceItem(it)
                return (
                  <li key={it.id} className="flex gap-3">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                      <Scene kind={exp.scene} className="h-full w-full" />
                    </div>
                    <div className="min-w-0 flex-1 text-sm">
                      <p className="truncate font-bold">{loc(exp.title)}</p>
                      <p className="text-muted">
                        {formatDate(it.date, lang, { day: 'numeric', month: 'short', year: 'numeric' })} · {t(it.guests === 1 ? 'guests.one' : 'guests.other', { n: it.guests })}
                      </p>
                    </div>
                    <span className="text-sm font-bold tabular-nums">{money(p.total)}</span>
                  </li>
                )
              })}
            </ul>
            <dl className="mt-5 space-y-1.5 border-t border-ink/10 pt-4 text-sm">
              <div className="flex justify-between text-muted">
                <dt>{t('cart.subtotal')}</dt>
                <dd className="tabular-nums">{money(subtotal)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-lagoon">
                  <dt>
                    {t('cart.discount')} ({promoCode})
                  </dt>
                  <dd className="tabular-nums">−{money(discount)}</dd>
                </div>
              )}
              <div className="flex items-baseline justify-between pt-2 font-display text-3xl font-bold">
                <dt>{t('cart.total')}</dt>
                <dd className="tabular-nums">
                  <AnimatedMoney cents={total} />
                </dd>
              </div>
            </dl>
            <p className="mt-4 flex items-center gap-2 text-xs text-muted">
              <Lock size={13} className="text-lagoon" /> {t('book.freeCancel')}
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
