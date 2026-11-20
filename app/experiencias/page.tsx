'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ExperienceCard } from '@/components/ExperienceCard'
import { EXPERIENCES, type Tag } from '@/lib/data'
import { rank } from '@/lib/match'
import { useStore } from '@/lib/store'

const TAGS: Tag[] = ['nature', 'adventure', 'culture', 'food', 'relax']

export default function Catalog() {
  const { t, loc, profile, favs } = useStore()
  const [q, setQ] = useState('')
  const [tags, setTags] = useState<Tag[]>([])
  const [days, setDays] = useState<'any' | '1' | '2'>('any')
  const [sort, setSort] = useState<'recommended' | 'priceAsc' | 'priceDesc' | 'rating'>('recommended')
  const [onlyFavs, setOnlyFavs] = useState(false)

  const list = useMemo(() => {
    const base = profile ? rank(profile.vibe, profile.pace, profile.group) : EXPERIENCES.map((e) => ({ exp: e, score: undefined as number | undefined }))
    const needle = q.trim().toLowerCase()
    let out = base.filter(({ exp }) => {
      if (needle && !`${loc(exp.title)} ${loc(exp.region)} ${loc(exp.tagline)}`.toLowerCase().includes(needle)) return false
      if (tags.length && !tags.some((g) => exp.tags.includes(g))) return false
      if (days === '1' && exp.days > 1) return false
      if (days === '2' && exp.days < 2) return false
      if (onlyFavs && !favs.includes(exp.slug)) return false
      return true
    })
    if (sort === 'priceAsc') out = [...out].sort((a, b) => a.exp.priceUSD - b.exp.priceUSD)
    if (sort === 'priceDesc') out = [...out].sort((a, b) => b.exp.priceUSD - a.exp.priceUSD)
    if (sort === 'rating') out = [...out].sort((a, b) => b.exp.rating - a.exp.rating)
    return out
  }, [q, tags, days, sort, onlyFavs, favs, profile, loc])

  const dirty = q || tags.length || days !== 'any' || onlyFavs
  const clear = () => {
    setQ('')
    setTags([])
    setDays('any')
    setOnlyFavs(false)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-8 pt-28 sm:px-6">
      <h1 className="h-display text-5xl font-bold sm:text-7xl">{t('catalog.title')}</h1>
      <p className="mt-4 max-w-xl text-lg text-muted">{t('catalog.sub')}</p>

      <div className="mt-10 grid gap-4 md:grid-cols-[1fr_auto_auto]">
        <label className="relative block">
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('catalog.search')} aria-label={t('catalog.search')} className="input !pl-11" />
        </label>
        <select value={days} onChange={(e) => setDays(e.target.value as 'any')} aria-label={t('catalog.days')} className="input md:w-auto">
          <option value="any">{t('catalog.days')}: {t('catalog.days.any')}</option>
          <option value="1">{t('catalog.days.1')}</option>
          <option value="2">{t('catalog.days.2')}</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value as 'rating')} aria-label={t('catalog.sort')} className="input md:w-auto">
          <option value="recommended">{t('sort.recommended')}</option>
          <option value="priceAsc">{t('sort.priceAsc')}</option>
          <option value="priceDesc">{t('sort.priceDesc')}</option>
          <option value="rating">{t('sort.rating')}</option>
        </select>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {TAGS.map((g) => {
          const on = tags.includes(g)
          return (
            <button key={g} aria-pressed={on} onClick={() => setTags(on ? tags.filter((x) => x !== g) : [...tags, g])} className={`chip ${on ? '!border-ink !bg-ink !text-bg' : ''}`}>
              {t(`tag.${g}` as 'tag.nature')}
            </button>
          )
        })}
        <button aria-pressed={onlyFavs} onClick={() => setOnlyFavs(!onlyFavs)} className={`chip ${onlyFavs ? '!border-brand !bg-brand !text-onbrand' : ''}`}>
          <Heart size={14} className={onlyFavs ? 'fill-current' : ''} /> {t('catalog.favs')}
        </button>
        {dirty ? (
          <button onClick={clear} className="chip border-transparent text-muted">
            <X size={14} /> {t('catalog.clear')}
          </button>
        ) : null}
        <span className="ml-auto text-sm text-muted" aria-live="polite">
          {t('catalog.results', { n: list.length })}
        </span>
      </div>

      <motion.div layout className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((r) => (
            <motion.div key={r.exp.slug} layout initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.35 }}>
              <ExperienceCard exp={r.exp} match={r.score} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {list.length === 0 && (
        <div className="py-24 text-center">
          <p className="text-lg text-muted">{t('catalog.empty')}</p>
          <button onClick={clear} className="btn-ghost mt-6">
            {t('catalog.clear')}
          </button>
        </div>
      )}
    </div>
  )
}
