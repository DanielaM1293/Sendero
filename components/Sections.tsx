'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import { ArrowLeft, ArrowRight, CalendarCheck, Plus, ShieldCheck, Sparkles, Ticket, Users2, Languages, Quote } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { getExp, TESTIMONIALS } from '@/lib/data'
import type { Key } from '@/lib/dict'
import { useStore } from '@/lib/store'
import { Scene } from './Scene'

export function TrustStrip() {
  const { t } = useStore()
  const items = [
    { icon: Users2, a: 'trust.group', b: 'trust.group.d' },
    { icon: CalendarCheck, a: 'trust.cancel', b: 'trust.cancel.d' },
    { icon: Languages, a: 'trust.guides', b: 'trust.guides.d' },
    { icon: ShieldCheck, a: 'trust.secure', b: 'trust.secure.d' },
  ] as const
  return (
    <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
      <ul className="grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-4">
        {items.map(({ icon: Icon, a, b }) => (
          <li key={a} className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-lagoon/15 text-lagoon">
              <Icon size={20} />
            </span>
            <div>
              <p className="font-display text-base font-bold leading-tight">{t(a)}</p>
              <p className="text-sm text-muted">{t(b)}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function HowItWorks() {
  const { t } = useStore()
  const ref = useRef<HTMLOListElement>(null)
  const inView = useInView(ref, { once: true, margin: '-20% 0px' })
  const steps = [
    { icon: CalendarCheck, a: 'how.s1.t', b: 'how.s1.d' },
    { icon: Sparkles, a: 'how.s2.t', b: 'how.s2.d' },
    { icon: Ticket, a: 'how.s3.t', b: 'how.s3.d' },
  ] as const
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <h2 className="h-display max-w-xl text-4xl font-bold sm:text-5xl">{t('how.title')}</h2>
      <ol ref={ref} className="relative mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
        {/* La línea del sendero se dibuja al entrar en pantalla */}
        <svg aria-hidden="true" className="pointer-events-none absolute left-0 right-0 top-6 hidden h-4 w-full md:block" preserveAspectRatio="none" viewBox="0 0 100 4">
          <motion.line x1="4" y1="2" x2="96" y2="2" stroke="rgb(var(--muted))" strokeWidth="0.9" strokeLinecap="round" strokeDasharray="0.1 1.6" vectorEffect="non-scaling-stroke" initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 1.6, ease: 'easeInOut' }} />
        </svg>
        {steps.map(({ icon: Icon, a, b }, i) => (
          <motion.li key={a} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 + i * 0.25, duration: 0.6 }} className="relative">
            <span className="relative z-10 mb-5 grid h-12 w-12 place-items-center rounded-full bg-brand text-onbrand shadow-[0_10px_24px_-8px_rgb(var(--brand)/.8)]">
              <Icon size={20} />
            </span>
            <h3 className="font-display text-2xl font-bold">{t(a)}</h3>
            <p className="mt-2 max-w-xs text-muted">{t(b)}</p>
          </motion.li>
        ))}
      </ol>
    </section>
  )
}

export function Testimonials() {
  const { t, loc } = useStore()
  const [ref, embla] = useEmblaCarousel({ loop: true, align: 'center' })
  const [sel, setSel] = useState(0)
  const [pause, setPause] = useState(false)

  const onSelect = useCallback(() => embla && setSel(embla.selectedScrollSnap()), [embla])
  useEffect(() => {
    if (!embla) return
    onSelect()
    embla.on('select', onSelect)
    return () => {
      embla.off('select', onSelect)
    }
  }, [embla, onSelect])
  useEffect(() => {
    if (!embla || pause) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => embla.scrollNext(), 6500)
    return () => clearInterval(id)
  }, [embla, pause])

  return (
    <section id="opiniones" className="overflow-hidden py-24" onMouseEnter={() => setPause(true)} onMouseLeave={() => setPause(false)} onFocus={() => setPause(true)} onBlur={() => setPause(false)}>
      <div className="mx-auto flex max-w-7xl items-end justify-between gap-4 px-4 sm:px-6">
        <h2 className="h-display max-w-2xl text-4xl font-bold sm:text-6xl">{t('rev.title')}</h2>
        <div className="hidden gap-2 sm:flex">
          <button onClick={() => embla?.scrollPrev()} aria-label={t('carousel.prev')} className="grid h-12 w-12 place-items-center rounded-full border border-ink/20 transition hover:bg-ink hover:text-bg">
            <ArrowLeft size={18} />
          </button>
          <button onClick={() => embla?.scrollNext()} aria-label={t('carousel.next')} className="grid h-12 w-12 place-items-center rounded-full border border-ink/20 transition hover:bg-ink hover:text-bg">
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
      <div className="mt-12" ref={ref}>
        <div className="flex">
          {TESTIMONIALS.map((r, i) => {
            const exp = getExp(r.slug)!
            const on = i === sel
            return (
              <div key={r.name} className="min-w-0 shrink-0 basis-[88%] px-3 md:basis-[62%] lg:basis-[48%]">
                <motion.figure animate={{ scale: on ? 1 : 0.94, opacity: on ? 1 : 0.55 }} transition={{ duration: 0.5 }} className="leaf-sm grid overflow-hidden bg-surface md:grid-cols-[0.8fr_1.2fr]">
                  <div className="relative hidden min-h-[16rem] md:block">
                    <Scene kind={exp.scene} className="absolute inset-0 h-full w-full dark:brightness-90" />
                  </div>
                  <div className="flex flex-col p-7 sm:p-9">
                    <Quote size={30} className="text-brand" />
                    <blockquote className="mt-4 font-display text-xl font-semibold leading-snug sm:text-2xl">{loc(r.text)}</blockquote>
                    <figcaption className="mt-auto pt-6">
                      <p className="font-bold">{r.name}</p>
                      <p className="text-sm text-muted">{loc(r.from)}</p>
                      <Link href={`/experiencias/${exp.slug}`} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-lagoon hover:underline">
                        {t('rev.on', { title: loc(exp.title) })} <ArrowRight size={14} />
                      </Link>
                    </figcaption>
                  </div>
                </motion.figure>
              </div>
            )
          })}
        </div>
      </div>
      <div className="mt-8 flex justify-center gap-2">
        {TESTIMONIALS.map((_, i) => (
          <button key={i} onClick={() => embla?.scrollTo(i)} aria-label={`${i + 1}`} className={`h-2 rounded-full transition-all duration-300 ${i === sel ? 'w-8 bg-brand' : 'w-2 bg-ink/25'}`} />
        ))}
      </div>
    </section>
  )
}

export function Faq() {
  const { t } = useStore()
  const [open, setOpen] = useState<number | null>(0)
  const qs = [1, 2, 3, 4, 5, 6]
  return (
    <section id="faq" className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.5fr]">
      <h2 className="h-display text-4xl font-bold sm:text-5xl">{t('faq.title')}</h2>
      <div className="divide-y divide-ink/15 border-y border-ink/15">
        {qs.map((n, i) => {
          const isOpen = open === i
          return (
            <div key={n}>
              <button onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-4 py-5 text-left font-display text-xl font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
                {t(`faq.q${n}` as Key)}
                <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink/20">
                  <Plus size={16} />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                    <p className="max-w-2xl pb-6 text-muted">{t(`faq.a${n}` as Key)}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export function CtaBand() {
  const { t } = useStore()
  return (
    <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
      <div className="leaf flex flex-col items-start justify-between gap-6 bg-brand p-8 text-onbrand sm:flex-row sm:items-center sm:p-12">
        <div>
          <h2 className="h-display text-4xl font-bold sm:text-5xl">{t('cta.title')}</h2>
          <p className="mt-3 max-w-lg opacity-90">{t('cta.sub')}</p>
        </div>
        <Link href="/#tu-sendero" className="btn bg-onbrand text-brand hover:-translate-y-0.5">
          {t('cta.btn')} <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  )
}
