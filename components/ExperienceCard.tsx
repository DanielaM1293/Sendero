'use client'

import { motion } from 'framer-motion'
import { Clock, Heart, Star, Users } from 'lucide-react'
import Link from 'next/link'
import type { Experience } from '@/lib/data'
import { useStore } from '@/lib/store'
import { Scene } from './Scene'

export function FavButton({ slug, className = '' }: { slug: string; className?: string }) {
  const { favs, toggleFav, t, showToast } = useStore()
  const on = favs.includes(slug)
  return (
    <motion.button
      whileTap={{ scale: 0.8 }}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleFav(slug)
        if (!on) showToast(t('fav.added'))
      }}
      aria-pressed={on}
      aria-label={on ? t('fav.remove') : t('fav.add')}
      className={`grid h-10 w-10 place-items-center rounded-full bg-black/35 text-white backdrop-blur-md transition hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${className}`}
    >
      <motion.span key={String(on)} initial={{ scale: 0.6 }} animate={{ scale: [0.6, 1.35, 1] }} transition={{ duration: 0.4 }}>
        <Heart size={18} className={on ? 'fill-brand text-brand' : ''} />
      </motion.span>
    </motion.button>
  )
}

export function Dots({ n, max = 3 }: { n: number; max?: number }) {
  return (
    <span className="inline-flex gap-1" aria-hidden="true">
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={`h-1.5 w-3.5 rounded-full ${i < n ? 'bg-sun' : 'bg-ink/15'}`} />
      ))}
    </span>
  )
}

export function ExperienceCard({ exp, match, className = '' }: { exp: Experience; match?: number; className?: string }) {
  const { t, loc, money } = useStore()
  return (
    <motion.article whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }} className={`group relative flex h-full flex-col ${className}`}>
      <Link href={`/experiencias/${exp.slug}`} className="flex h-full flex-col focus-visible:outline-none">
        <div className="leaf relative aspect-[4/5] overflow-hidden bg-surface2 shadow-[0_24px_50px_-28px_rgb(var(--ink)/.55)] ring-brand transition group-focus-visible:ring-2">
          <Scene kind={exp.scene} className="h-full w-full transition duration-700 ease-out group-hover:scale-110 dark:brightness-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/10" />
          <div className="absolute left-4 right-4 top-4 flex items-start justify-between">
            <div className="flex flex-wrap gap-1.5">
              {match !== undefined && <span className="rounded-full bg-brand px-3 py-1 text-xs font-bold text-onbrand">{t('card.match', { n: match })}</span>}
              {exp.tags.slice(0, 2).map((g) => (
                <span key={g} className="rounded-full bg-black/35 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                  {t(`tag.${g}` as 'tag.nature')}
                </span>
              ))}
            </div>
          </div>
          <div className="absolute inset-x-5 bottom-5 text-white">
            <p className="text-sm text-white/80">{loc(exp.region)}</p>
            <h3 className="mt-1 font-display text-2xl font-bold leading-[1.05] tracking-tight [text-wrap:balance]">{loc(exp.title)}</h3>
          </div>
        </div>
        <div className="mt-4 flex items-end justify-between gap-3 px-1">
          <div className="min-w-0 text-sm text-muted">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="flex items-center gap-1 font-semibold text-ink">
                <Star size={14} className="fill-sun text-sun" /> {exp.rating}
                <span className="font-normal text-muted">({exp.reviews})</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} /> {loc(exp.duration)}
              </span>
              <span className="flex items-center gap-1">
                <Users size={14} /> {exp.maxGroup}
              </span>
            </p>
            <p className="mt-2 flex items-center gap-2">
              <Dots n={exp.difficulty} /> {t(`diff.${exp.difficulty}` as 'diff.1')}
            </p>
          </div>
          <p className="shrink-0 text-right">
            <span className="block text-xs text-muted">{t('card.from')}</span>
            <span className="font-display text-2xl font-bold">{money(exp.priceUSD * 100)}</span>
          </p>
        </div>
      </Link>
      <FavButton slug={exp.slug} className="absolute right-4 top-4" />
    </motion.article>
  )
}
