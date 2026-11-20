'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { DayInfo } from '@/lib/availability'
import { ymd } from '@/lib/availability'
import { cap } from '@/lib/format'
import { useStore } from '@/lib/store'

export function Calendar({ slug, value, onChange, onInfo }: { slug: string; value: string | null; onChange: (d: string) => void; onInfo: (d: Record<string, DayInfo>) => void }) {
  const { t, lang } = useStore()
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [days, setDays] = useState<Record<string, DayInfo>>({})
  const [loading, setLoading] = useState(true)
  const [dir, setDir] = useState(1)

  const month = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`

  useEffect(() => {
    let alive = true
    setLoading(true)
    fetch(`/api/availability?slug=${slug}&month=${month}`)
      .then((r) => r.json())
      .then((r) => {
        if (!alive) return
        setDays(r.days)
        onInfo(r.days)
        setLoading(false)
      })
      .catch(() => alive && setLoading(false))
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, month])

  const locale = lang === 'es' ? 'es-CO' : 'en-US'
  const title = cap(new Intl.DateTimeFormat(locale, { month: 'long', year: lang === 'es' ? undefined : 'numeric' }).format(cursor)) + (lang === 'es' ? ` ${cursor.getFullYear()}` : '')
  const weekdays = Array.from({ length: 7 }).map((_, i) => new Intl.DateTimeFormat(locale, { weekday: 'narrow' }).format(new Date(2024, 0, 7 + i)))
  const first = cursor.getDay()
  const count = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate()
  const canPrev = cursor > new Date(today.getFullYear(), today.getMonth(), 1)
  const move = (n: number) => {
    setDir(n)
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + n, 1))
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-lg font-bold">{title}</h3>
        <div className="flex gap-1">
          <button onClick={() => move(-1)} disabled={!canPrev} aria-label={t('book.prevMonth')} className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 transition hover:bg-ink/10 disabled:opacity-30">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => move(1)} aria-label={t('book.nextMonth')} className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 transition hover:bg-ink/10">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 pb-1 text-center text-xs font-semibold text-muted">
        {weekdays.map((w, i) => (
          <span key={i}>{w}</span>
        ))}
      </div>
      <AnimatePresence mode="wait" initial={false} custom={dir}>
        <motion.div
          key={month}
          custom={dir}
          initial={{ opacity: 0, x: 24 * dir }}
          animate={{ opacity: loading ? 0.45 : 1, x: 0 }}
          exit={{ opacity: 0, x: -24 * dir }}
          transition={{ duration: 0.22 }}
          className="grid grid-cols-7 gap-1"
          aria-busy={loading}
        >
          {Array.from({ length: first }).map((_, i) => (
            <span key={`b${i}`} />
          ))}
          {Array.from({ length: count }).map((_, i) => {
            const date = ymd(new Date(cursor.getFullYear(), cursor.getMonth(), i + 1))
            const info = days[date]
            const past = new Date(date + 'T12:00:00') < today
            const out = !info || info.spots === 0 || past
            const sel = value === date
            const low = info && info.spots > 0 && info.spots <= 3
            return (
              <button
                key={date}
                disabled={out || loading}
                onClick={() => onChange(date)}
                aria-pressed={sel}
                aria-label={`${date}${info ? `, ${info.spots === 0 ? t('book.soldOut') : t('book.spots', { n: info.spots })}` : ''}`}
                className={`relative grid aspect-square place-items-center rounded-xl text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${sel ? 'bg-brand text-onbrand shadow-[0_8px_20px_-6px_rgb(var(--brand)/.8)]' : out ? 'text-muted/40 line-through decoration-1' : 'hover:bg-brand/15'}`}
              >
                {i + 1}
                {!out && info?.tag === 'peak' && <span className={`absolute bottom-1 h-1 w-1 rounded-full ${sel ? 'bg-onbrand' : 'bg-sun'}`} />}
                {!out && low && !sel && <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-brand" />}
              </button>
            )
          })}
        </motion.div>
      </AnimatePresence>
      <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-sun" /> {t('book.peak')}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" /> {t('book.low', { n: 3 }).replace('3', '≤3')}
        </span>
      </p>
    </div>
  )
}
