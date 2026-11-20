'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { EXPERIENCES, type Tag } from '@/lib/data'
import { rank } from '@/lib/match'
import { useStore } from '@/lib/store'
import { ExperienceCard } from './ExperienceCard'

const TAGS: Tag[] = ['nature', 'adventure', 'culture', 'food', 'relax']

export function ExperienceCarousel() {
  const { t, profile } = useStore()
  const [filter, setFilter] = useState<Tag | 'all'>('all')
  const [emblaRef, embla] = useEmblaCarousel({ align: 'start', dragFree: true, containScroll: 'trimSnaps' })
  const [progress, setProgress] = useState(0)
  const [can, setCan] = useState({ prev: false, next: true })

  const list = useMemo(() => {
    const ranked = profile ? rank(profile.vibe, profile.pace, profile.group) : EXPERIENCES.map((e) => ({ exp: e, score: undefined as number | undefined }))
    return ranked.filter((r) => filter === 'all' || r.exp.tags.includes(filter))
  }, [filter, profile])

  const onScroll = useCallback(() => {
    if (!embla) return
    setProgress(Math.max(0, Math.min(1, embla.scrollProgress())))
    setCan({ prev: embla.canScrollPrev(), next: embla.canScrollNext() })
  }, [embla])

  useEffect(() => {
    if (!embla) return
    onScroll()
    embla.on('scroll', onScroll).on('reInit', onScroll)
    return () => {
      embla.off('scroll', onScroll).off('reInit', onScroll)
    }
  }, [embla, onScroll])

  useEffect(() => {
    embla?.reInit()
    embla?.scrollTo(0)
  }, [filter, profile, embla])

  return (
    <section id="experiencias" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2 className="h-display text-5xl font-bold sm:text-6xl">{t('exp.title')}</h2>
            <p className="mt-4 text-lg text-muted">{profile ? t('exp.forYou') + '. ' : ''}{t('exp.sub')}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => embla?.scrollPrev()} disabled={!can.prev} aria-label={t('carousel.prev')} className="grid h-12 w-12 place-items-center rounded-full border border-ink/20 transition hover:bg-ink hover:text-bg disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink">
              <ArrowLeft size={18} />
            </button>
            <button onClick={() => embla?.scrollNext()} disabled={!can.next} aria-label={t('carousel.next')} className="grid h-12 w-12 place-items-center rounded-full border border-ink/20 transition hover:bg-ink hover:text-bg disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink">
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="no-scrollbar mt-8 flex gap-2 overflow-x-auto pb-1" role="group">
          {(['all', ...TAGS] as const).map((g) => (
            <button key={g} onClick={() => setFilter(g)} aria-pressed={filter === g} className={`chip shrink-0 ${filter === g ? '!border-ink !bg-ink !text-bg' : ''}`}>
              {g === 'all' ? t('exp.all') : t(`tag.${g}` as 'tag.nature')}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 overflow-hidden pl-4 sm:pl-6 xl:pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]" ref={emblaRef}>
        <div className="flex gap-6 pr-6 pb-6" style={{ touchAction: 'pan-y pinch-zoom' }}>
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((r, idx) => (
              <motion.div key={r.exp.slug} layout initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ duration: 0.35, delay: idx * 0.04 }} className="w-[78vw] max-w-[340px] shrink-0 sm:w-[340px]">
                <ExperienceCard exp={r.exp} match={r.score} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="mx-auto mt-4 flex max-w-7xl items-center gap-6 px-4 sm:px-6">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-ink/10" aria-hidden="true">
          <div className="h-full rounded-full bg-brand transition-[width] duration-200" style={{ width: `${Math.max(12, progress * 100)}%` }} />
        </div>
        <Link href="/experiencias" className="shrink-0 text-sm font-bold underline decoration-brand decoration-2 underline-offset-4 hover:text-brand">
          {t('exp.catalog')}
        </Link>
      </div>
    </section>
  )
}
