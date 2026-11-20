'use client'

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, Moon, Sun, Sunrise, Sunset } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useId, useMemo, useState } from 'react'
import { peaks, ridge, rng } from '@/lib/art'
import { getExp } from '@/lib/data'
import { useStore } from '@/lib/store'
import { Scene } from './Scene'

const TOD = [
  { id: 'dawn', icon: Sunrise, slug: 'valle-de-cocora', sky: ['#1d4e73', '#e58f8f', '#ffd9a8'], sun: [1060, 470], sunC: '#ffe3a3', far: '#7f9fb4', mid: '#4d8480', near: '#1f5a52', stars: 0, glow: 0.9 },
  { id: 'noon', icon: Sun, slug: 'guatape-y-el-penol', sky: ['#1b6a94', '#5db6dd', '#bfe8f2'], sun: [800, 130], sunC: '#fff6c9', far: '#6aa0b5', mid: '#3d9a7c', near: '#1a6e55', stars: 0, glow: 0.5 },
  { id: 'dusk', icon: Sunset, slug: 'cartagena-sabores-del-caribe', sky: ['#3a2766', '#e0567a', '#ffb067'], sun: [520, 470], sunC: '#ffd27a', far: '#8c5a86', mid: '#5a3f73', near: '#2e2a55', stars: 0.2, glow: 1 },
  { id: 'night', icon: Moon, slug: 'tatacoa-noche-de-estrellas', sky: ['#060f20', '#10244a', '#1d3b5e'], sun: [1000, 150], sunC: '#f3f0e6', far: '#1c3250', mid: '#12273f', near: '#0a1a2e', stars: 1, glow: 0.2 },
] as const

const tr = 'transition: all 1.4s cubic-bezier(.65,0,.35,1)'
const T = { transition: 'fill 1.4s cubic-bezier(.65,0,.35,1), stop-color 1.4s cubic-bezier(.65,0,.35,1), opacity 1.4s ease' }

function Palm({ x, y, h, lean, color }: { x: number; y: number; h: number; lean: number; color: string }) {
  const tx = x + lean
  const ty = y - h
  return (
    <g style={T} fill={color} stroke={color}>
      <path d={`M${x} ${y} Q${x + lean / 2} ${y - h / 2} ${tx} ${ty}`} strokeWidth={h > 260 ? 8 : 5} fill="none" strokeLinecap="round" />
      {[-70, -38, -10, 14, 40, 70].map((a) => (
        <ellipse key={a} cx={tx + Math.sin((a * Math.PI) / 180) * 34} cy={ty - Math.cos((a * Math.PI) / 180) * 6 + 8} rx="34" ry="5.5" stroke="none" transform={`rotate(${a} ${tx} ${ty})`} />
      ))}
    </g>
  )
}

export function Hero() {
  const { t, loc, money, profile } = useStore()
  const uid = useId().replace(/:/g, '')
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  const [auto, setAuto] = useState(true)
  const tod = TOD[i]
  const exp = getExp(tod.slug)!

  useEffect(() => {
    if (!auto || reduce) return
    const id = setInterval(() => setI((v) => (v + 1) % TOD.length), 7000)
    return () => clearInterval(id)
  }, [auto, reduce])

  // Parallax por ratón y scroll
  const mx = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 20 })
  const { scrollY } = useScroll()
  const farX = useTransform(sx, (v) => v * -12)
  const midX = useTransform(sx, (v) => v * -26)
  const nearX = useTransform(sx, (v) => v * -48)
  const sunY = useTransform(scrollY, [0, 700], [0, 140])
  const farY = useTransform(scrollY, [0, 700], [0, 40])
  const nearY = useTransform(scrollY, [0, 700], [0, -30])
  const textY = useTransform(scrollY, [0, 600], [0, 90])
  const textO = useTransform(scrollY, [0, 500], [1, 0])

  const stars = useMemo(() => {
    const r = rng(77)
    return Array.from({ length: 130 }).map(() => ({ x: r() * 1600, y: r() * 1000 - 600, r: r() * 1.8 + 0.5, d: r() * 3 }))
  }, [])
  const far = useMemo(() => peaks(4, 470, 160, 14, 1600, 700), [])
  const mid = useMemo(() => ridge(6, 520, 150, 9, 1600, 700), [])
  const near = useMemo(() => ridge(12, 610, 110, 10, 1600, 700), [])
  const palms = useMemo(() => {
    const r = rng(5)
    return [120, 230, 1280, 1400, 1490].map((x) => ({ x, y: 640, h: 230 + r() * 120, lean: (r() - 0.5) * 50 }))
  }, [])

  const words = t('hero.title').split(' ')

  return (
    <section
      className="relative isolate min-h-[100svh] overflow-hidden text-white"
      onMouseMove={(e) => mx.set((e.clientX / window.innerWidth - 0.5) * 2)}
      style={{ background: tod.sky[0], transition: 'background 1.4s' }}
    >
      {/* Paisaje */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 -700 1600 1400" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <defs>
          <linearGradient id={`sky${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={tod.sky[0]} style={T} />
            <stop offset=".72" stopColor={tod.sky[1]} style={T} />
            <stop offset="1" stopColor={tod.sky[2]} style={T} />
          </linearGradient>
          <radialGradient id={`glow${uid}`}>
            <stop offset="0" stopColor={tod.sunC} stopOpacity=".7" style={T} />
            <stop offset="1" stopColor={tod.sunC} stopOpacity="0" style={T} />
          </radialGradient>
          <mask id={`trail${uid}`}>
            <motion.path d="M150 700 C 330 640 430 700 560 610 S 760 540 700 480 S 640 420 760 372" stroke="#fff" strokeWidth="8" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3.2, delay: 0.9, ease: 'easeInOut' }} />
          </mask>
        </defs>
        <rect x="-10" y="-700" width="1620" height="1410" fill={`url(#sky${uid})`} />
        {stars.map((s, k) => (
          <circle key={k} cx={s.x} cy={s.y} r={s.r} fill="#fff" className="animate-twinkle" style={{ opacity: tod.stars, transition: 'opacity 1.4s', animationDelay: `${s.d}s` }} />
        ))}
        <motion.g style={{ y: sunY }}>
          <g style={{ transform: `translate(${tod.sun[0]}px, ${tod.sun[1]}px)`, transition: 'transform 1.6s cubic-bezier(.65,0,.35,1)' }}>
            <circle r="260" fill={`url(#glow${uid})`} style={{ opacity: tod.glow, transition: 'opacity 1.4s' }} />
            <circle r={tod.id === 'dusk' ? 74 : 52} fill={tod.sunC} style={T} />
            {tod.id === 'night' && <circle cx="22" cy="-8" r="46" fill={tod.sky[0]} />}
          </g>
        </motion.g>
        <g className="animate-drift" style={{ opacity: tod.id === 'night' ? 0.12 : 0.55, transition: 'opacity 1.4s' }} fill="#fff">
          <ellipse cx="340" cy="190" rx="120" ry="20" />
          <ellipse cx="420" cy="170" rx="70" ry="18" />
          <ellipse cx="1180" cy="270" rx="140" ry="22" />
        </g>
        <motion.g style={{ x: farX, y: farY }}>
          <path d={far} fill={tod.far} style={T} />
        </motion.g>
        <motion.g style={{ x: midX }}>
          <path d={mid} fill={tod.mid} style={T} />
          <path d="M150 700 C 330 640 430 700 560 610 S 760 540 700 480 S 640 420 760 372" stroke={tod.sunC} strokeWidth="6" strokeLinecap="round" strokeDasharray="0.1 20" fill="none" mask={`url(#trail${uid})`} style={T} />
          <circle cx="760" cy="372" r="9" fill="rgb(var(--brand))" />
        </motion.g>
        <motion.g style={{ x: nearX, y: nearY }}>
          <path d={near} fill={tod.near} style={T} />
          {palms.map((p, k) => (
            <Palm key={k} {...p} color={tod.near} />
          ))}
        </motion.g>
        <rect x="-10" y="690" width="1620" height="20" fill="rgb(var(--bg))" />
        <path d="M-10 690 C 300 650 600 700 900 672 S 1400 650 1610 684 V710 H-10Z" fill="rgb(var(--bg))" />
      </svg>

      {/* Contenido */}
      <motion.div style={{ y: textY, opacity: textO }} className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-start px-4 pb-72 pt-28 sm:px-6 sm:pt-32 md:pb-64">
        <h1 className="h-display max-w-5xl text-[clamp(2.9rem,8.6vw,8rem)] font-bold [text-wrap:balance]">
          {words.map((w, k) => (
            <span key={k} className="mr-[0.22em] inline-block overflow-hidden align-bottom">
              <span className="wdth-word inline-block" style={{ animationDelay: `${0.15 + k * 0.09}s` }}>
                {w}
              </span>
            </span>
          ))}
        </h1>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.7 }} className="mt-6 max-w-xl text-lg text-white [text-shadow:0_1px_16px_rgba(0,0,0,.45)]">
          {t('hero.sub')}
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.15, duration: 0.7 }} className="mt-8 flex flex-wrap gap-3">
          <Link href="/experiencias" className="btn-primary">
            {t('hero.cta1')} <ArrowRight size={16} />
          </Link>
          <Link href="/#tu-sendero" className="btn border border-white/40 text-white hover:bg-white/15">
            {t('hero.cta2')}
          </Link>
        </motion.div>
        {profile && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5 text-sm font-semibold text-white [text-shadow:0_1px_12px_rgba(0,0,0,.5)]">
            {t(profile.name ? 'hero.profile' : 'hero.profileAnon', { name: profile.name, vibe: t(`tag.${profile.vibe}` as 'tag.nature').toLowerCase(), pace: t(`pace.${profile.pace}` as 'pace.slow').toLowerCase() })}
          </motion.p>
        )}
      </motion.div>

      {/* Selector de momento + tarjeta */}
      <div className="absolute inset-x-0 bottom-0 z-20 mx-auto flex max-w-7xl flex-col items-stretch gap-3 px-4 pb-8 sm:px-6 md:flex-row md:items-end md:justify-between" onMouseEnter={() => setAuto(false)} onFocus={() => setAuto(false)}>
        <div role="tablist" aria-label={t('tod.label')} className="relative flex self-start rounded-full bg-black/35 p-1 backdrop-blur-md">
          {TOD.map((o, k) => {
            const Icon = o.icon
            const on = k === i
            return (
              <button
                key={o.id}
                role="tab"
                aria-selected={on}
                onClick={() => {
                  setI(k)
                  setAuto(false)
                }}
                className="relative flex items-center gap-2 rounded-full px-3.5 py-2.5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {on && <motion.span layoutId="tod-pill" className="absolute inset-0 rounded-full bg-white" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                <Icon size={16} className={`relative ${on ? 'text-[#0e2428]' : ''}`} />
                <span className={`relative ${on ? 'text-[#0e2428]' : 'hidden sm:inline'}`}>{t(`tod.${o.id}` as 'tod.dawn')}</span>
              </button>
            )
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={exp.slug} initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
            <Link href={`/experiencias/${exp.slug}`} className="group flex w-full items-center gap-4 rounded-3xl bg-black/40 p-3 pr-5 backdrop-blur-xl transition hover:bg-black/55 md:w-[26rem]">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl">
                <Scene kind={exp.scene} className="h-full w-full" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white/65">{t('hero.now')}</p>
                <p className="truncate font-display text-lg font-bold leading-tight">{loc(exp.title)}</p>
                <p className="text-sm text-white/75">
                  {t('card.from')} {money(exp.priceUSD * 100)}
                </p>
              </div>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand text-onbrand transition group-hover:translate-x-1" aria-label={t('hero.reserve')}>
                <ArrowRight size={18} />
              </span>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
