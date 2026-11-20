'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Check, Lock } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Logo } from './Logo'

export function Footer() {
  const { t } = useStore()
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  return (
    <footer className="relative mt-24 overflow-hidden bg-panel text-onpanel">
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-display text-[26vw] font-extrabold leading-none tracking-tighter text-white/[0.04]">
        sendero
      </div>
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-onpanel/70">{t('foot.tag')}</p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (/^\S+@\S+\.\S+$/.test(email)) setDone(true)
            }}
            className="mt-8 max-w-sm"
          >
            <label htmlFor="news" className="mb-2 block text-sm font-semibold">
              {t('foot.news.title')}
            </label>
            <AnimatePresence mode="wait" initial={false}>
              {done ? (
                <motion.p key="ok" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm">
                  <Check size={16} className="text-lagoon" /> {t('foot.news.ok')}
                </motion.p>
              ) : (
                <motion.div key="f" exit={{ opacity: 0, y: -8 }} className="flex gap-2">
                  <input id="news" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('foot.news.ph')} className="w-full rounded-full border border-white/20 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-onpanel/40 focus:border-brand" />
                  <button className="btn-primary shrink-0">{t('foot.news.btn')}</button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
        <div>
          <h3 className="mb-4 font-display text-lg font-bold">{t('foot.explore')}</h3>
          <ul className="space-y-2.5 text-onpanel/75">
            <li><Link className="hover:text-white" href="/experiencias">{t('nav.experiences')}</Link></li>
            <li><Link className="hover:text-white" href="/#tu-sendero">{t('nav.quiz')}</Link></li>
            <li><Link className="hover:text-white" href="/#opiniones">{t('nav.reviews')}</Link></li>
            <li><Link className="hover:text-white" href="/#faq">{t('nav.faq')}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-display text-lg font-bold">{t('foot.help')}</h3>
          <ul className="space-y-2.5 text-onpanel/75">
            <li><a className="hover:text-white" href="mailto:hola@sendero.example">{t('foot.contact')}</a></li>
            <li><a className="hover:text-white" href="#">{t('foot.terms')}</a></li>
            <li><a className="hover:text-white" href="#">{t('foot.privacy')}</a></li>
          </ul>
          <p className="mt-6 flex items-center gap-2 text-sm text-onpanel/70">
            <Lock size={14} /> {t('trust.secure.d')}
          </p>
        </div>
      </div>
      <div className="relative border-t border-white/10 px-4 py-5 text-center text-xs text-onpanel/55">
        © {new Date().getFullYear()} {t('foot.rights')} {t('foot.demo')}
      </div>
    </footer>
  )
}
