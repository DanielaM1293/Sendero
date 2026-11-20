'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus, Tag, Trash2, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getExp } from '@/lib/data'
import { formatDate } from '@/lib/format'
import { priceItem } from '@/lib/pricing'
import { useStore } from '@/lib/store'
import { AnimatedMoney } from './AnimatedMoney'
import { Scene } from './Scene'

export function CartDrawer() {
  const { t, loc, lang, cart, cartOpen, setCartOpen, removeItem, setGuests, promoCode, setPromoCode, promo, subtotal, discount, total, showToast } = useStore()
  const [code, setCode] = useState('')
  const [bad, setBad] = useState(false)

  useEffect(() => {
    if (!cartOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setCartOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [cartOpen, setCartOpen])

  const apply = () => {
    if (!code.trim()) return
    // Valida contra el mismo cálculo del servidor
    fetch('/api/promo', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ code, subtotal }) })
      .then((r) => r.json())
      .then((r) => {
        if (r.valid) {
          setPromoCode(r.code)
          setBad(false)
          setCode('')
        } else setBad(true)
      })
      .catch(() => setBad(true))
  }

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCartOpen(false)} className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm" />
          <motion.aside
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-label={t('cart.title')}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 36 }}
            className="fixed inset-y-0 right-0 z-[80] flex w-full max-w-md flex-col bg-bg shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
              <h2 className="font-display text-2xl font-bold">{t('cart.title')}</h2>
              <button onClick={() => setCartOpen(false)} aria-label={t('nav.close')} className="grid h-9 w-9 place-items-center rounded-full hover:bg-ink/10">
                <X size={18} />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
                <svg width="120" height="60" viewBox="0 0 120 60" fill="none" className="text-muted">
                  <path d="M4 52 C30 52 30 14 60 28 S96 8 116 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="0.1 9" />
                </svg>
                <p className="text-muted">{t('cart.empty')}</p>
                <Link href="/experiencias" onClick={() => setCartOpen(false)} className="btn-primary">
                  {t('cart.emptyCta')}
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
                  <AnimatePresence initial={false}>
                    {cart.map((it) => {
                      const exp = getExp(it.slug)!
                      const p = priceItem(it)
                      return (
                        <motion.li key={it.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 80 }} className="flex gap-3 rounded-2xl border border-ink/10 bg-surface p-3">
                          <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl">
                            <Scene kind={exp.scene} className="h-full w-full" />
                          </div>
                          <div className="flex min-w-0 flex-1 flex-col">
                            <Link href={`/experiencias/${exp.slug}`} onClick={() => setCartOpen(false)} className="line-clamp-2 font-display text-base font-bold leading-tight hover:text-brand">
                              {loc(exp.title)}
                            </Link>
                            <span className="mt-0.5 text-xs text-muted">{formatDate(it.date, lang, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            <div className="mt-auto flex items-center justify-between pt-2">
                              <div className="flex items-center gap-1 rounded-full border border-ink/15">
                                <button onClick={() => setGuests(it.id, it.guests - 1)} disabled={it.guests <= 1} aria-label={t('cart.minus')} className="grid h-7 w-7 place-items-center disabled:opacity-30">
                                  <Minus size={13} />
                                </button>
                                <span className="w-5 text-center text-sm font-bold tabular-nums">{it.guests}</span>
                                <button onClick={() => setGuests(it.id, it.guests + 1)} aria-label={t('cart.plus')} className="grid h-7 w-7 place-items-center">
                                  <Plus size={13} />
                                </button>
                              </div>
                              <AnimatedMoney cents={p.total} className="text-sm font-bold tabular-nums" />
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              removeItem(it.id)
                              showToast(t('cart.removed'))
                            }}
                            aria-label={t('cart.remove')}
                            className="self-start rounded-full p-1.5 text-muted hover:bg-ink/10 hover:text-brand"
                          >
                            <Trash2 size={15} />
                          </button>
                        </motion.li>
                      )
                    })}
                  </AnimatePresence>
                </ul>

                <div className="space-y-4 border-t border-ink/10 bg-surface px-5 py-5">
                  {promo ? (
                    <div className="flex items-center justify-between rounded-2xl bg-lagoon/15 px-4 py-3 text-sm font-semibold text-lagoon">
                      <span className="flex items-center gap-2">
                        <Tag size={15} /> {t('cart.promoOk', { code: promo.code, label: loc(promo.label) })}
                      </span>
                      <button onClick={() => setPromoCode('')} aria-label={t('cart.remove')}>
                        <X size={15} />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex gap-2">
                        <input value={code} onChange={(e) => (setCode(e.target.value), setBad(false))} onKeyDown={(e) => e.key === 'Enter' && apply()} placeholder={t('cart.promo')} aria-label={t('cart.promo')} className="input !py-2.5 uppercase" />
                        <button onClick={apply} className="btn-dark shrink-0 !py-2.5">
                          {t('cart.apply')}
                        </button>
                      </div>
                      <p className={`mt-1.5 text-xs ${bad ? 'text-brand' : 'text-muted'}`}>{bad ? t('cart.promoBad') : t('cart.promoHint')}</p>
                    </div>
                  )}
                  {promoCode && !promo && <p className="text-xs text-brand">{t('cart.promoBad')}</p>}
                  <dl className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-muted">
                      <dt>{t('cart.subtotal')}</dt>
                      <dd className="tabular-nums">
                        <AnimatedMoney cents={subtotal} />
                      </dd>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-lagoon">
                        <dt>{t('cart.discount')}</dt>
                        <dd className="tabular-nums">
                          −<AnimatedMoney cents={discount} />
                        </dd>
                      </div>
                    )}
                    <div className="flex items-baseline justify-between pt-1 font-display text-2xl font-bold">
                      <dt>{t('cart.total')}</dt>
                      <dd className="tabular-nums">
                        <AnimatedMoney cents={total} />
                      </dd>
                    </div>
                  </dl>
                  <Link href="/checkout" onClick={() => setCartOpen(false)} className="btn-primary w-full !py-4 text-base">
                    {t('cart.checkout')}
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
