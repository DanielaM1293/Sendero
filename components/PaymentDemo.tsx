'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Lock, Wifi } from 'lucide-react'
import { useState } from 'react'
import { useStore } from '@/lib/store'

const luhn = (n: string) => {
  let s = 0
  let alt = false
  for (let i = n.length - 1; i >= 0; i--) {
    let d = Number(n[i])
    if (alt) {
      d *= 2
      if (d > 9) d -= 9
    }
    s += d
    alt = !alt
  }
  return s % 10 === 0
}
const brand = (n: string) => (n.startsWith('4') ? 'VISA' : /^5[1-5]|^2[2-7]/.test(n) ? 'MASTERCARD' : /^3[47]/.test(n) ? 'AMEX' : '')

export interface DemoSubmit {
  scenario: 'ok' | 'decline'
}

export function PaymentDemo({ label, busy, error, onSubmit, defaultName }: { label: string; busy: boolean; error: string | null; onSubmit: (d: DemoSubmit) => void; defaultName: string }) {
  const { t } = useStore()
  const [num, setNum] = useState('')
  const [name, setName] = useState(defaultName)
  const [exp, setExp] = useState('')
  const [cvc, setCvc] = useState('')
  const [focus, setFocus] = useState<'num' | 'name' | 'exp' | 'cvc' | null>(null)
  const [errs, setErrs] = useState<Record<string, string>>({})

  const digits = num.replace(/\s/g, '')
  const fmtNum = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  const fmtExp = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4)
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const er: Record<string, string> = {}
    if (digits.length < 15 || !luhn(digits)) er.num = t('err.card')
    if (!name.trim()) er.name = t('err.required')
    const m = /^(\d{2})\/(\d{2})$/.exec(exp)
    if (!m || +m[1] < 1 || +m[1] > 12 || new Date(2000 + +m[2], +m[1], 0) < new Date()) er.exp = t('err.expiry')
    if (!/^\d{3,4}$/.test(cvc)) er.cvc = t('err.cvc')
    setErrs(er)
    if (Object.keys(er).length) return
    onSubmit({ scenario: digits === '4000000000000002' ? 'decline' : 'ok' })
  }

  const flipped = focus === 'cvc'
  const field = (k: string) => `input ${errs[k] ? '!border-brand' : ''}`

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <p className="rounded-2xl bg-sun/15 px-4 py-3 text-sm text-ink">{t('co.demo')}</p>

      {/* Tarjeta animada */}
      <div className="mx-auto h-48 w-full max-w-sm [perspective:1000px]" aria-hidden="true">
        <motion.div animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="relative h-full w-full [transform-style:preserve-3d]">
          <div className="absolute inset-0 overflow-hidden rounded-3xl bg-gradient-to-br from-panel via-lagoon to-brand p-6 text-white shadow-2xl [backface-visibility:hidden]">
            <svg className="absolute -right-6 -top-6 h-40 w-40 opacity-20" viewBox="0 0 100 100" fill="none">
              <path d="M5 90 C30 90 30 50 55 50 S80 10 98 8" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeDasharray="0.1 14" />
            </svg>
            <div className="flex items-center justify-between">
              <span className="h-8 w-11 rounded-md bg-gradient-to-br from-sun to-[#fff2c0]" />
              <Wifi size={20} className="rotate-90 opacity-80" />
            </div>
            <p className="mt-8 font-mono text-xl tracking-[0.12em]">{(digits.padEnd(16, '•').match(/.{1,4}/g) ?? []).join(' ')}</p>
            <div className="mt-5 flex items-end justify-between text-xs">
              <div>
                <p className="opacity-70">{t('card.holder')}</p>
                <p className="max-w-[10rem] truncate text-sm font-semibold uppercase">{name || '—'}</p>
              </div>
              <div className="text-right">
                <p className="opacity-70">{t('card.valid')}</p>
                <p className="text-sm font-semibold">{exp || 'MM/AA'}</p>
              </div>
              <span className="text-sm font-extrabold italic">{brand(digits)}</span>
            </div>
          </div>
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#1b2f33] to-panel py-6 text-white shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="h-10 bg-black/70" />
            <div className="mx-6 mt-6 flex items-center justify-end rounded bg-white px-3 py-2 font-mono text-sm text-black">{cvc.padEnd(3, '•')}</div>
          </div>
        </motion.div>
      </div>

      <div>
        <label htmlFor="cn" className="label mb-1.5 block">{t('card.number')}</label>
        <input id="cn" inputMode="numeric" autoComplete="cc-number" value={num} onFocus={() => setFocus('num')} onChange={(e) => setNum(fmtNum(e.target.value))} placeholder="4242 4242 4242 4242" className={field('num')} />
        {errs.num && <p className="mt-1 text-xs text-brand">{errs.num}</p>}
      </div>
      <div>
        <label htmlFor="cnm" className="label mb-1.5 block">{t('card.name')}</label>
        <input id="cnm" autoComplete="cc-name" value={name} onFocus={() => setFocus('name')} onChange={(e) => setName(e.target.value)} className={field('name')} />
        {errs.name && <p className="mt-1 text-xs text-brand">{errs.name}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="ce" className="label mb-1.5 block">{t('card.expiry')}</label>
          <input id="ce" inputMode="numeric" autoComplete="cc-exp" value={exp} onFocus={() => setFocus('exp')} onChange={(e) => setExp(fmtExp(e.target.value))} placeholder="MM/AA" className={field('exp')} />
          {errs.exp && <p className="mt-1 text-xs text-brand">{errs.exp}</p>}
        </div>
        <div>
          <label htmlFor="cc" className="label mb-1.5 block">{t('card.cvc')}</label>
          <input id="cc" inputMode="numeric" autoComplete="cc-csc" value={cvc} onFocus={() => setFocus('cvc')} onBlur={() => setFocus(null)} onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="123" className={field('cvc')} />
          {errs.cvc && <p className="mt-1 text-xs text-brand">{errs.cvc}</p>}
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} role="alert" className="overflow-hidden rounded-2xl bg-brand/10 px-4 py-3 text-sm font-semibold text-brand">
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <button disabled={busy} className="btn-primary w-full !py-4 text-base">
        {busy ? (
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
