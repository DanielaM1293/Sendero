'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowLeft, Check, Clock, Mountain, Share2, Star, Users } from 'lucide-react'
import Link from 'next/link'
import { useRef } from 'react'
import { EXPERIENCES, getExp } from '@/lib/data'
import { useStore } from '@/lib/store'
import { Booking } from './Booking'
import { Dots, ExperienceCard, FavButton } from './ExperienceCard'
import { Scene } from './Scene'

export function ExperienceDetail({ slug }: { slug: string }) {
  const { t, loc, showToast } = useStore()
  const exp = getExp(slug)!
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const tlRef = useRef<HTMLOListElement>(null)
  const { scrollYProgress: tl } = useScroll({ target: tlRef, offset: ['start 70%', 'end 60%'] })

  const related = EXPERIENCES.filter((e) => e.slug !== slug)
    .map((e) => ({ e, s: e.tags.filter((g) => exp.tags.includes(g)).length }))
    .sort((a, b) => b.s - a.s)
    .slice(0, 3)

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) await navigator.share({ title: loc(exp.title), url })
      else {
        await navigator.clipboard.writeText(url)
        showToast(t('det.copied'))
      }
    } catch {}
  }

  return (
    <article>
      <div ref={heroRef} className="relative h-[68svh] min-h-[420px] overflow-hidden bg-panel">
        <motion.div style={{ y, scale }} className="absolute inset-0">
          <Scene kind={exp.scene} className="h-full w-full" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/30" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-10 pt-24 text-white sm:px-6">
          <Link href="/experiencias" className="mb-auto inline-flex w-fit items-center gap-2 rounded-full bg-black/35 px-4 py-2 text-sm font-semibold backdrop-blur-md hover:bg-black/55">
            <ArrowLeft size={15} /> {t('det.back')}
          </Link>
          <p className="text-white/80">{loc(exp.region)}</p>
          <h1 className="h-display mt-2 max-w-4xl text-[clamp(2.6rem,7vw,6rem)] font-bold [text-wrap:balance]">{loc(exp.title)}</h1>
          <p className="mt-4 max-w-xl text-lg text-white/85">{loc(exp.tagline)}</p>
        </div>
        <div className="absolute right-4 top-24 flex gap-2 sm:right-6">
          <button onClick={share} aria-label={t('det.share')} className="grid h-10 w-10 place-items-center rounded-full bg-black/35 text-white backdrop-blur-md hover:bg-black/55">
            <Share2 size={17} />
          </button>
          <FavButton slug={exp.slug} />
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_26rem]">
        <div className="min-w-0">
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: Star, a: `${exp.rating}`, b: t('det.reviews', { n: exp.reviews }) },
              { icon: Clock, a: loc(exp.duration), b: t('det.duration') },
              { icon: Users, a: t('det.group', { n: exp.maxGroup }), b: '' },
              { icon: Mountain, a: t(`diff.${exp.difficulty}` as 'diff.1'), b: t('det.difficulty') },
            ].map((s, i) => (
              <li key={i} className="rounded-2xl border border-ink/10 bg-surface p-4">
                <s.icon size={18} className={i === 0 ? 'fill-sun text-sun' : 'text-lagoon'} />
                <p className="mt-2 font-display text-lg font-bold leading-tight">{s.a}</p>
                {s.b && <p className="text-xs text-muted">{s.b}</p>}
                {i === 3 && <div className="mt-2"><Dots n={exp.difficulty} /></div>}
              </li>
            ))}
          </ul>

          <h2 className="h-display mt-14 text-3xl font-bold sm:text-4xl">{t('det.about')}</h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{loc(exp.desc)}</p>

          <ul className="mt-8 flex flex-wrap gap-2">
            {exp.highlights.map((h, i) => (
              <li key={i} className="flex items-center gap-2 rounded-full bg-lagoon/15 px-4 py-2 text-sm font-semibold text-lagoon">
                <Check size={14} /> {loc(h)}
              </li>
            ))}
          </ul>

          <h2 className="h-display mt-16 text-3xl font-bold sm:text-4xl">{t('det.itinerary')}</h2>
          <ol ref={tlRef} className="relative mt-8 space-y-8 pl-10">
            <span className="absolute bottom-2 left-[13px] top-2 w-0.5 bg-ink/10" />
            <motion.span style={{ scaleY: tl }} className="absolute bottom-2 left-[13px] top-2 w-0.5 origin-top bg-brand" />
            {exp.itinerary.map((s, i) => (
              <motion.li key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-10% 0px' }} transition={{ duration: 0.5 }} className="relative">
                <span className="absolute -left-10 top-0.5 grid h-7 w-7 place-items-center rounded-full border-2 border-brand bg-bg">
                  <span className="h-2 w-2 rounded-full bg-brand" />
                </span>
                <p className="text-sm font-semibold text-brand">{loc(s.t)}</p>
                <h3 className="font-display text-xl font-bold">{loc(s.title)}</h3>
                <p className="mt-1 max-w-xl text-muted">{loc(s.text)}</p>
              </motion.li>
            ))}
          </ol>

          <h2 className="h-display mt-16 text-3xl font-bold sm:text-4xl">{t('det.includes')}</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {exp.includes.map((x, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-lagoon/15 text-lagoon">
                  <Check size={14} />
                </span>
                {loc(x)}
              </li>
            ))}
          </ul>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Booking exp={exp} />
        </aside>
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <h2 className="h-display text-3xl font-bold sm:text-5xl">{t('det.related')}</h2>
        <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {related.map(({ e }) => (
            <ExperienceCard key={e.slug} exp={e} />
          ))}
        </div>
      </section>
    </article>
  )
}
