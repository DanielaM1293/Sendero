'use client'

import { motion } from 'framer-motion'
import { CalendarPlus, Check, Printer } from 'lucide-react'
import Link from 'next/link'
import QRCode from 'qrcode'
import { useEffect, useMemo, useRef, useState } from 'react'
import { getExp, type Experience } from '@/lib/data'
import { cap, formatDate } from '@/lib/format'
import { useStore, type CartItem, type Order } from '@/lib/store'
import { Scene } from './Scene'

function Confetti() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current
    if (!c || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = c.getContext('2d')!
    const dpr = window.devicePixelRatio || 1
    const resize = () => {
      c.width = innerWidth * dpr
      c.height = innerHeight * dpr
    }
    resize()
    const colors = ['#d02456', '#ff6b8f', '#e08a0e', '#ffc24b', '#0c7d80', '#4fd1c5']
    const parts = Array.from({ length: 140 }).map(() => ({
      x: innerWidth / 2,
      y: innerHeight * 0.35,
      vx: (Math.random() - 0.5) * 16,
      vy: -Math.random() * 15 - 4,
      s: Math.random() * 8 + 4,
      r: Math.random() * 6,
      vr: (Math.random() - 0.5) * 0.4,
      c: colors[Math.floor(Math.random() * colors.length)],
    }))
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      ctx.clearRect(0, 0, c.width, c.height)
      for (const p of parts) {
        p.vy += 0.35
        p.vx *= 0.99
        p.x += p.vx
        p.y += p.vy
        p.r += p.vr
        ctx.save()
        ctx.translate(p.x * dpr, p.y * dpr)
        ctx.rotate(p.r)
        ctx.fillStyle = p.c
        ctx.fillRect((-p.s / 2) * dpr, (-p.s / 4) * dpr, p.s * dpr, (p.s / 2) * dpr)
        ctx.restore()
      }
      if (now - start < 3800) raf = requestAnimationFrame(tick)
      else ctx.clearRect(0, 0, c.width, c.height)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[95] h-full w-full" />
}

function Qr({ text }: { text: string }) {
  const [svg, setSvg] = useState('')
  useEffect(() => {
    QRCode.toString(text, { type: 'svg', margin: 0, color: { dark: '#0e2428', light: '#ffffff' } }).then(setSvg)
  }, [text])
  return <div className="h-28 w-28 rounded-xl bg-white p-2 [&>svg]:h-full [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: svg }} />
}

function icsFor(order: Order, it: CartItem, exp: Experience, title: string) {
  const d = it.date.replace(/-/g, '')
  const end = new Date(it.date + 'T12:00:00')
  end.setDate(end.getDate() + exp.days)
  const e = `${end.getFullYear()}${String(end.getMonth() + 1).padStart(2, '0')}${String(end.getDate()).padStart(2, '0')}`
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Sendero//ES', 'BEGIN:VEVENT', `UID:${order.ref}-${it.slug}@sendero`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`, `DTSTART;VALUE=DATE:${d}`, `DTEND;VALUE=DATE:${e}`, `SUMMARY:${title}`, `DESCRIPTION:Reserva ${order.ref}`, 'END:VEVENT', 'END:VCALENDAR']
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${it.slug}.ics`
  a.click()
  URL.revokeObjectURL(a.href)
}

export function Confirmation() {
  const { t, loc, lang, ready, order, money } = useStore()
  const bring = useMemo(() => (order ? order.items.map((i) => getExp(i.slug)!.scene) : []), [order])
  void bring

  if (!ready) return <div className="min-h-[60svh]" />
  if (!order)
    return (
      <div className="grid min-h-[70svh] place-items-center px-6 pt-24 text-center">
        <div>
          <p className="text-lg text-muted">{t('ok.notfound')}</p>
          <Link href="/experiencias" className="btn-primary mt-6">
            {t('ok.next')}
          </Link>
        </div>
      </div>
    )

  return (
    <div className="mx-auto max-w-4xl px-4 pb-8 pt-28 sm:px-6">
      <Confetti />
      <div className="text-center">
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.1 }} className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-lagoon text-bg">
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <motion.path d="M5 13l4 4L19 7" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4, duration: 0.5 }} />
          </svg>
        </motion.span>
        <h1 className="h-display mt-6 text-5xl font-bold sm:text-7xl">{t('ok.title')}</h1>
        <p className="mt-4 text-lg text-muted">{t('ok.sub', { email: order.email })}</p>
        <p className="mt-6 inline-flex flex-col rounded-2xl bg-surface px-6 py-3 ring-1 ring-ink/10">
          <span className="text-xs text-muted">{t('ok.ref')}</span>
          <span className="font-mono text-2xl font-bold tracking-widest">{order.ref}</span>
        </p>
        {order.demo && <p className="mt-4 text-sm text-muted">{t('ok.demo')}</p>}
      </div>

      <ul className="mt-12 space-y-8">
        {order.items.map((it, idx) => {
          const exp = getExp(it.slug)!
          const items = t(`bring.${exp.scene}` as 'bring.cocora').split('|')
          return (
            <motion.li key={it.id} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + idx * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="print:break-inside-avoid">
              <div className="leaf-sm relative overflow-hidden bg-surface shadow-[0_30px_70px_-40px_rgb(var(--ink)/.6)] ring-1 ring-ink/10 sm:grid sm:grid-cols-[14rem_1fr_auto]">
                <div className="relative h-40 sm:h-auto">
                  <Scene kind={exp.scene} className="absolute inset-0 h-full w-full" />
                </div>
                {/* Perforación */}
                <div className="relative p-6 sm:border-l-2 sm:border-dashed sm:border-ink/20">
                  <span className="absolute -left-3 top-0 hidden h-6 w-6 -translate-y-1/2 rounded-full bg-bg sm:block" />
                  <span className="absolute -left-3 bottom-0 hidden h-6 w-6 translate-y-1/2 rounded-full bg-bg sm:block" />
                  <p className="text-xs font-semibold text-brand">{t('ok.pass')}</p>
                  <h2 className="font-display text-2xl font-bold leading-tight">{loc(exp.title)}</h2>
                  <p className="text-sm text-muted">{loc(exp.region)}</p>
                  <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-xs text-muted">{t('ok.date')}</dt>
                      <dd className="font-semibold">{cap(formatDate(it.date, lang, { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }))}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted">{t('ok.guests')}</dt>
                      <dd className="font-semibold">{t(it.guests === 1 ? 'guests.one' : 'guests.other', { n: it.guests })}</dd>
                    </div>
                    {it.addons.length > 0 && (
                      <div className="col-span-2">
                        <dt className="text-xs text-muted">{t('ok.addons')}</dt>
                        <dd className="font-semibold">{it.addons.map((a) => t(`addon.${a}` as 'addon.photo')).join(', ')}</dd>
                      </div>
                    )}
                  </dl>
                  <div className="mt-5">
                    <p className="mb-2 text-xs font-semibold text-muted">{t('ok.bring')}</p>
                    <ul className="flex flex-wrap gap-2">
                      {items.map((b) => (
                        <li key={b} className="flex items-center gap-1.5 rounded-full bg-lagoon/15 px-3 py-1 text-xs font-semibold text-lagoon">
                          <Check size={12} /> {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button onClick={() => icsFor(order, it, exp, loc(exp.title))} className="btn-ghost mt-5 !py-2.5 print:hidden">
                    <CalendarPlus size={16} /> {t('ok.addcal')}
                  </button>
                </div>
                <div className="flex items-center justify-center p-6 pt-0 sm:pt-6">
                  <Qr text={`SENDERO|${order.ref}|${it.slug}|${it.date}|${it.guests}`} />
                </div>
              </div>
            </motion.li>
          )
        })}
      </ul>

      <div className="mt-10 flex flex-col items-center gap-3 text-center">
        <p className="font-display text-2xl font-bold">
          {t('ok.paid')}: {money(order.total)}
        </p>
        <p className="text-sm text-muted">{t('ok.help')}</p>
        <div className="mt-3 flex flex-wrap justify-center gap-3 print:hidden">
          <Link href="/experiencias" className="btn-primary">
            {t('ok.next')}
          </Link>
          <button onClick={() => window.print()} className="btn-ghost">
            <Printer size={16} /> {t('ok.print')}
          </button>
        </div>
      </div>
    </div>
  )
}
