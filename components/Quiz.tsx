'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Compass, Flame, Heart, Leaf, Mountain, Sailboat, Sparkles, User, UserRound, Users, UtensilsCrossed, Zap } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import type { Group, Pace, Tag } from '@/lib/data'
import { rank } from '@/lib/match'
import { useStore } from '@/lib/store'
import { Scene } from './Scene'

const VIBES: { v: Tag; icon: typeof Leaf }[] = [
  { v: 'nature', icon: Leaf },
  { v: 'adventure', icon: Mountain },
  { v: 'culture', icon: Compass },
  { v: 'food', icon: UtensilsCrossed },
  { v: 'relax', icon: Sailboat },
]
const PACES: { v: Pace; icon: typeof Leaf }[] = [
  { v: 'slow', icon: Leaf },
  { v: 'medium', icon: Sparkles },
  { v: 'fast', icon: Zap },
]
const GROUPS: { v: Group; icon: typeof Leaf }[] = [
  { v: 'solo', icon: User },
  { v: 'couple', icon: Heart },
  { v: 'friends', icon: Users },
  { v: 'family', icon: UserRound },
]

export function Quiz() {
  const { t, loc, profile, setProfile, showToast } = useStore()
  const [step, setStep] = useState(profile ? 4 : 0)
  const [dir, setDir] = useState(1)
  const [vibe, setVibe] = useState<Tag | null>(profile?.vibe ?? null)
  const [pace, setPace] = useState<Pace | null>(profile?.pace ?? null)
  const [group, setGroup] = useState<Group | null>(profile?.group ?? null)
  const [name, setName] = useState(profile?.name ?? '')

  const go = (n: number) => {
    setDir(n > step ? 1 : -1)
    setStep(n)
  }
  const choose = (setter: () => void) => {
    setter()
    setTimeout(() => go(step + 1), 260)
  }
  const finish = () => {
    if (!vibe || !pace || !group) return
    setProfile({ name: name.trim(), vibe, pace, group })
    showToast(t('quiz.saved'))
    go(4)
  }
  const redo = () => {
    setProfile(null)
    setVibe(null)
    setPace(null)
    setGroup(null)
    setName('')
    setStep(0)
    setDir(-1)
  }

  const result = vibe && pace && group ? rank(vibe, pace, group).slice(0, 3) : []
  const questions = ['quiz.q1', 'quiz.q2', 'quiz.q3', 'quiz.q4'] as const

  const Option = ({ on, icon: Icon, label, desc, onClick }: { on: boolean; icon: typeof Leaf; label: string; desc?: string; onClick: () => void }) => (
    <motion.button whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }} onClick={onClick} aria-pressed={on} className={`group relative flex flex-col items-start gap-3 rounded-3xl border p-5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${on ? 'border-brand bg-brand/10' : 'border-ink/15 bg-surface hover:border-ink/40'}`}>
      <span className={`grid h-11 w-11 place-items-center rounded-2xl transition ${on ? 'bg-brand text-onbrand' : 'bg-surface2 text-ink'}`}>
        <Icon size={20} />
      </span>
      <span className="font-display text-xl font-bold leading-tight">{label}</span>
      {desc && <span className="text-sm text-muted">{desc}</span>}
      {on && (
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-4 top-4 grid h-6 w-6 place-items-center rounded-full bg-brand text-onbrand">
          <Check size={14} />
        </motion.span>
      )}
    </motion.button>
  )

  return (
    <section id="tu-sendero" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="leaf relative overflow-clip bg-panel p-6 text-onpanel sm:p-12">
          <svg aria-hidden="true" className="pointer-events-none absolute -right-20 -top-10 h-[130%] w-[60%] text-white/[0.035]" viewBox="0 0 400 400" fill="none">
            <path d="M20 380 C120 380 120 220 220 220 S300 60 400 40" stroke="currentColor" strokeWidth="22" strokeLinecap="round" strokeDasharray="0.1 52" />
          </svg>

          <div className="relative grid gap-10 lg:grid-cols-[1fr_1.5fr]">
            <div>
              <h2 className="h-display text-4xl font-bold sm:text-5xl">{t('quiz.title')}</h2>
              <p className="mt-4 max-w-md text-onpanel/75">{t('quiz.sub')}</p>
              {step < 4 && (
                <div className="mt-8 flex items-center gap-2" aria-label={t('quiz.step', { n: step + 1, total: 4 })}>
                  {[0, 1, 2, 3].map((n) => (
                    <span key={n} className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/15">
                      <motion.span className="block h-full bg-brand" initial={false} animate={{ width: n <= step ? '100%' : '0%' }} transition={{ duration: 0.5 }} />
                    </span>
                  ))}
                </div>
              )}
              {step === 4 && (
                <button onClick={redo} className="mt-8 text-sm font-semibold underline decoration-brand decoration-2 underline-offset-4">
                  {t('quiz.redo')}
                </button>
              )}
            </div>

            <div className="min-h-[22rem]">
              <AnimatePresence mode="wait" custom={dir} initial={false}>
                <motion.div
                  key={step}
                  custom={dir}
                  variants={{ in: (d: number) => ({ opacity: 0, x: 40 * d }), mid: { opacity: 1, x: 0 }, out: (d: number) => ({ opacity: 0, x: -40 * d }) }}
                  initial="in"
                  animate="mid"
                  exit="out"
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                >
                  {step < 4 && <h3 className="mb-5 font-display text-2xl font-bold">{t(questions[step])}</h3>}

                  {step === 0 && (
                    <div className="grid gap-3 text-ink sm:grid-cols-2 [&>*:last-child]:sm:col-span-2">
                      {VIBES.map((o) => (
                        <Option key={o.v} on={vibe === o.v} icon={o.icon} label={t(`tag.${o.v}` as 'tag.nature')} desc={t(`quiz.vibe.${o.v}` as 'quiz.vibe.nature')} onClick={() => choose(() => setVibe(o.v))} />
                      ))}
                    </div>
                  )}
                  {step === 1 && (
                    <div className="grid gap-3 text-ink sm:grid-cols-3">
                      {PACES.map((o) => (
                        <Option key={o.v} on={pace === o.v} icon={o.icon} label={t(`pace.${o.v}` as 'pace.slow')} desc={t(`pace.${o.v}.d` as 'pace.slow.d')} onClick={() => choose(() => setPace(o.v))} />
                      ))}
                    </div>
                  )}
                  {step === 2 && (
                    <div className="grid grid-cols-2 gap-3 text-ink">
                      {GROUPS.map((o) => (
                        <Option key={o.v} on={group === o.v} icon={o.icon} label={t(`group.${o.v}` as 'group.solo')} onClick={() => choose(() => setGroup(o.v))} />
                      ))}
                    </div>
                  )}
                  {step === 3 && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        finish()
                      }}
                      className="space-y-5"
                    >
                      <input value={name} onChange={(e) => setName(e.target.value)} maxLength={30} placeholder={t('quiz.namePh')} aria-label={t('quiz.q4')} className="input !bg-white/10 !text-onpanel !border-white/25 text-lg placeholder:!text-onpanel/50" autoFocus />
                      <button className="btn-primary">
                        {t('quiz.see')} <ArrowRight size={16} />
                      </button>
                    </form>
                  )}
                  {step === 4 && (
                    <div>
                      <h3 className="mb-5 font-display text-2xl font-bold">{profile?.name ? t('quiz.result', { name: profile.name }) : t('quiz.resultAnon')}</h3>
                      <ul className="space-y-3">
                        {result.map((r, k) => (
                          <motion.li key={r.exp.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: k * 0.12 }}>
                            <Link href={`/experiencias/${r.exp.slug}`} className="group flex items-center gap-4 rounded-3xl bg-white/10 p-3 pr-5 transition hover:bg-white/15">
                              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl">
                                <Scene kind={r.exp.scene} className="h-full w-full" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate font-display text-lg font-bold">{loc(r.exp.title)}</p>
                                <div className="mt-2 flex items-center gap-3">
                                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/15">
                                    <motion.span className="block h-full rounded-full bg-brand" initial={{ width: 0 }} animate={{ width: `${r.score}%` }} transition={{ duration: 0.9, delay: 0.2 + k * 0.12, ease: [0.22, 1, 0.36, 1] }} />
                                  </span>
                                  <span className="text-xs font-bold tabular-nums">{t('quiz.match', { n: r.score })}</span>
                                </div>
                                <p className="mt-1.5 flex flex-wrap gap-x-3 text-xs text-onpanel/70">
                                  {r.why.map((w) => (
                                    <span key={w} className="flex items-center gap-1">
                                      <Check size={12} className="text-lagoon" /> {t(`quiz.why.${w}` as 'quiz.why.vibe')}
                                    </span>
                                  ))}
                                </p>
                              </div>
                              <ArrowRight size={18} className="shrink-0 transition group-hover:translate-x-1" />
                            </Link>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {step > 0 && step < 4 && (
                    <button onClick={() => go(step - 1)} className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-onpanel/80 hover:text-white">
                      <ArrowLeft size={15} /> {t('quiz.back')}
                    </button>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
