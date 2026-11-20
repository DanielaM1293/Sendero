'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Aperture, Bus, Minus, Plus, ShieldPlus, ShieldCheck, Utensils } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import type { DayInfo } from '@/lib/availability'
import { ADDONS, type Experience } from '@/lib/data'
import { cap, formatDate } from '@/lib/format'
import { priceItem } from '@/lib/pricing'
import { useStore } from '@/lib/store'
import { AnimatedMoney } from './AnimatedMoney'
import { Calendar } from './Calendar'

const ICONS = { photo: Aperture, transport: Bus, lunch: Utensils, insurance: ShieldPlus }

export function Booking({ exp }: { exp: Experience }) {
  const { t, lang, money, addItem, showToast, setCartOpen, loc } = useStore()
  const router = useRouter()
  const [date, setDate] = useState<string | null>(null)
  const [info, setInfo] = useState<Record<string, DayInfo>>({})
  const [guests, setGuests] = useState(2)
  const [addons, setAddons] = useState<string[]>([])

  const day = date ? info[date] : undefined
  const max = Math.min(day?.spots ?? exp.maxGroup, exp.maxGroup)
  const g = Math.min(guests, Math.max(1, max))
  const price = date ? priceItem({ slug: exp.slug, date, guests: g, addons }) : null

  const toggle = (id: string) => setAddons((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]))
  const pick = (d: string) => {
    setDate(d)
    const s = info[d]?.spots ?? exp.maxGroup
    if (guests > s) setGuests(s)
  }
  const submit = (go: boolean) => {
    if (!date) return
    addItem({ slug: exp.slug, date, guests: g, addons })
    if (go) router.push('/checkout')
    else {
      showToast(t('book.added'))
      setCartOpen(true)
    }
  }
  const spotsLabel = useMemo(() => (day ? (day.spots <= 3 ? t('book.low', { n: day.spots }) : t('book.spots', { n: day.spots })) : ''), [day, t])

  return (
    <div className="leaf-sm bg-surface p-5 shadow-[0_30px_70px_-40px_rgb(var(--ink)/.6)] ring-1 ring-ink/10 sm:p-7">
      <div className="mb-5 flex items-baseline justify-between">
        <p>
          <span className="text-sm text-muted">{t('card.from')} </span>
          <span className="font-display text-3xl font-bold">{money(exp.priceUSD * 100)}</span>
          <span className="text-sm text-muted"> {t('card.perPerson')}</span>
        </p>
      </div>

      <h2 className="mb-3 text-sm font-bold">{t('book.pickDate')}</h2>
      <Calendar slug={exp.slug} value={date} onChange={pick} onInfo={(d) => setInfo((p) => ({ ...p, ...d }))} />

      <AnimatePresence>
        {date && day && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="mt-5 flex items-center justify-between rounded-2xl bg-brand/10 px-4 py-3 text-sm">
              <span>
                <span className="block text-xs text-muted">{t('book.selected')}</span>
                <span className="font-bold">{cap(formatDate(date, lang, { weekday: 'long', day: 'numeric', month: 'long' }))}</span>
              </span>
              <span className="text-right text-xs font-semibold">
                <span className={day.spots <= 3 ? 'text-brand' : 'text-lagoon'}>{spotsLabel}</span>
                {day.tag && <span className="block text-sun">{day.tag === 'peak' ? t('book.peak') : t('book.weekend')}</span>}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-5 flex items-center justify-between">
        <span className="text-sm font-bold">{t('book.guests')}</span>
        <div className="flex items-center gap-1 rounded-full border border-ink/20">
          <button onClick={() => setGuests(Math.max(1, g - 1))} disabled={g <= 1} aria-label={t('cart.minus')} className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-ink/10 disabled:opacity-30">
            <Minus size={15} />
          </button>
          <motion.span key={g} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-8 text-center font-bold tabular-nums" aria-live="polite">
            {g}
          </motion.span>
          <button onClick={() => setGuests(Math.min(max, g + 1))} disabled={g >= max} aria-label={t('cart.plus')} className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-ink/10 disabled:opacity-30">
            <Plus size={15} />
          </button>
        </div>
      </div>
      {g >= max && date && <p className="mt-1.5 text-right text-xs text-muted">{t('book.max', { n: max })}</p>}

      <h2 className="mb-3 mt-6 text-sm font-bold">{t('book.addons')}</h2>
      <ul className="space-y-2">
        {ADDONS.map((a) => {
          const Icon = ICONS[a.icon]
          const on = addons.includes(a.id)
          return (
            <li key={a.id}>
              <button onClick={() => toggle(a.id)} aria-pressed={on} className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${on ? 'border-brand bg-brand/10' : 'border-ink/15 hover:border-ink/35'}`}>
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl transition ${on ? 'bg-brand text-onbrand' : 'bg-surface2'}`}>
                  <Icon size={18} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold">{t(`addon.${a.id}` as 'addon.photo')}</span>
                  <span className="block truncate text-xs text-muted">{t(`addon.${a.id}.d` as 'addon.photo.d')}</span>
                </span>
                <span className="text-right text-sm font-bold">
                  +{money(a.price * 100)}
                  <span className="block text-[11px] font-normal text-muted">{a.per === 'person' ? t('addon.person') : t('addon.booking')}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      <div className="mt-6 border-t border-ink/10 pt-5">
        {price ? (
          <dl className="space-y-1.5 text-sm">
            <div className="flex justify-between text-muted">
              <dt>{t('book.priceLine', { n: g, price: money(price.unit) })}</dt>
              <dd className="tabular-nums">{money(price.base)}</dd>
            </div>
            {price.add > 0 && (
              <div className="flex justify-between text-muted">
                <dt>{t('book.addonsTotal')}</dt>
                <dd className="tabular-nums">{money(price.add)}</dd>
              </div>
            )}
            <div className="flex items-baseline justify-between pt-1 font-display text-3xl font-bold">
              <dt>{t('book.total')}</dt>
              <dd className="tabular-nums">
                <AnimatedMoney cents={price.total} />
              </dd>
            </div>
          </dl>
        ) : (
          <p className="text-sm text-muted">{t('book.selectFirst')}</p>
        )}
        <div className="mt-5 grid gap-2">
          <button onClick={() => submit(true)} disabled={!date} className="btn-primary !py-4 text-base">
            {t('book.reserve')}
          </button>
          <button onClick={() => submit(false)} disabled={!date} className="btn-ghost">
            {t('book.add')}
          </button>
        </div>
        <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted">
          <ShieldCheck size={14} className="text-lagoon" /> {t('book.freeCancel')}
        </p>
        <p className="mt-1 text-center text-xs text-muted">{t('book.peakNote')}</p>
      </div>
    </div>
  )
}
