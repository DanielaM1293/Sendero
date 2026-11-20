'use client'

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Menu, ShoppingBag, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'

function Segmented<T extends string>({ value, options, onChange, label }: { value: T; options: { v: T; l: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div role="group" aria-label={label} className="relative flex rounded-full border border-[color-mix(in_srgb,currentColor_28%,transparent)] p-0.5 text-xs font-bold">
      {options.map((o) => (
        <button key={o.v} onClick={() => onChange(o.v)} aria-pressed={value === o.v} className="relative z-10 rounded-full px-2.5 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
          {value === o.v && <motion.span layoutId={`seg-${label}`} className="absolute inset-0 -z-10 rounded-full bg-brand" transition={{ type: 'spring', stiffness: 420, damping: 32 }} />}
          <span className={value === o.v ? 'text-onbrand' : ''}>{o.l}</span>
        </button>
      ))}
    </div>
  )
}

export function Header() {
  const { t, lang, setLang, currency, setCurrency, cart, setCartOpen } = useStore()
  const path = usePathname()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menu, setMenu] = useState(false)
  const count = cart.length

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 40)
    setHidden(y > prev && y > 400 && !menu)
  })

  const onHero = path === '/' && !scrolled
  const links = [
    { href: '/experiencias', l: t('nav.experiences') },
    { href: '/#tu-sendero', l: t('nav.quiz') },
    { href: '/#opiniones', l: t('nav.reviews') },
    { href: '/#faq', l: t('nav.faq') },
  ]

  return (
    <>
      <motion.header
        animate={{ y: hidden ? -90 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${onHero ? 'text-white' : 'text-ink'} ${scrolled || path !== '/' ? 'border-b border-ink/10 bg-bg/80 backdrop-blur-xl' : ''}`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" aria-label="Sendero" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-semibold lg:flex">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="relative py-1 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-brand after:transition after:duration-300 hover:after:scale-x-100">
                {l.l}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="hidden sm:block">
              <Segmented label={t('cur.toggle')} value={currency} onChange={setCurrency} options={[{ v: 'USD', l: 'USD' }, { v: 'COP', l: 'COP' }]} />
            </div>
            <Segmented label={t('lang.toggle')} value={lang} onChange={setLang} options={[{ v: 'es', l: 'ES' }, { v: 'en', l: 'EN' }]} />
            <ThemeToggle />
            <button onClick={() => setCartOpen(true)} aria-label={t('nav.cart')} className="relative grid h-10 w-10 place-items-center rounded-full transition hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
              <ShoppingBag size={19} />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span key={count} initial={{ scale: 0 }} animate={{ scale: [0, 1.4, 1] }} exit={{ scale: 0 }} className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[11px] font-bold text-onbrand">
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <button onClick={() => setMenu(true)} aria-label={t('nav.menu')} className="grid h-10 w-10 place-items-center rounded-full lg:hidden">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menu && (
          <motion.div initial={{ clipPath: 'circle(0% at 92% 4%)' }} animate={{ clipPath: 'circle(150% at 92% 4%)' }} exit={{ clipPath: 'circle(0% at 92% 4%)' }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="fixed inset-0 z-[60] bg-panel text-onpanel">
            <div className="flex h-16 items-center justify-between px-4">
              <Logo />
              <button onClick={() => setMenu(false)} aria-label={t('nav.close')} className="grid h-10 w-10 place-items-center">
                <X size={22} />
              </button>
            </div>
            <nav className="flex flex-col gap-2 px-6 pt-8">
              {links.map((l, i) => (
                <motion.div key={l.href} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 + i * 0.07 }}>
                  <Link href={l.href} onClick={() => setMenu(false)} className="block font-display text-5xl font-bold tracking-tight">
                    {l.l}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-8 sm:hidden">
                <Segmented label={t('cur.toggle')} value={currency} onChange={setCurrency} options={[{ v: 'USD', l: 'USD' }, { v: 'COP', l: 'COP' }]} />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
