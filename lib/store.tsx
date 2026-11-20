'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { en, es, type Key } from './dict'
import { formatMoney, type Currency, type Lang } from './format'
import { priceItem, validatePromo } from './pricing'
import type { Group, L, Pace, Tag } from './data'

export interface CartItem {
  id: string
  slug: string
  date: string
  guests: number
  addons: string[]
}
export interface Profile {
  name: string
  vibe: Tag
  pace: Pace
  group: Group
}
export interface Order {
  ref: string
  createdAt: string
  email: string
  name: string
  items: CartItem[]
  subtotal: number
  discount: number
  total: number
  demo: boolean
  promo?: string
}

const K = {
  lang: 'sendero.lang',
  cur: 'sendero.cur',
  cart: 'sendero.cart',
  profile: 'sendero.profile',
  favs: 'sendero.favs',
  promo: 'sendero.promo',
  order: 'sendero.order',
}

function read<T>(k: string, d: T): T {
  try {
    const v = localStorage.getItem(k)
    return v ? (JSON.parse(v) as T) : d
  } catch {
    return d
  }
}
function write(k: string, v: unknown) {
  try {
    localStorage.setItem(k, JSON.stringify(v))
  } catch {}
}

interface Ctx {
  ready: boolean
  lang: Lang
  setLang: (l: Lang) => void
  t: (k: Key, vars?: Record<string, string | number>) => string
  loc: (l: L) => string
  currency: Currency
  setCurrency: (c: Currency) => void
  money: (cents: number) => string
  cart: CartItem[]
  addItem: (i: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  setGuests: (id: string, n: number) => void
  clearCart: () => void
  promoCode: string
  setPromoCode: (c: string) => void
  subtotal: number
  discount: number
  total: number
  promo: ReturnType<typeof validatePromo>
  profile: Profile | null
  setProfile: (p: Profile | null) => void
  favs: string[]
  toggleFav: (slug: string) => void
  cartOpen: boolean
  setCartOpen: (o: boolean) => void
  toast: string | null
  showToast: (m: string) => void
  order: Order | null
  setOrder: (o: Order | null) => void
}

const StoreCtx = createContext<Ctx | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [lang, setLangState] = useState<Lang>('es')
  const [currency, setCurrencyState] = useState<Currency>('USD')
  const [cart, setCart] = useState<CartItem[]>([])
  const [promoCode, setPromoCodeState] = useState('')
  const [profile, setProfileState] = useState<Profile | null>(null)
  const [favs, setFavs] = useState<string[]>([])
  const [order, setOrderState] = useState<Order | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    const savedLang = read<Lang | null>(K.lang, null)
    setLangState(savedLang ?? (navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'es'))
    setCurrencyState(read<Currency>(K.cur, 'USD'))
    setCart(read<CartItem[]>(K.cart, []))
    setPromoCodeState(read<string>(K.promo, ''))
    setProfileState(read<Profile | null>(K.profile, null))
    setFavs(read<string[]>(K.favs, []))
    setOrderState(read<Order | null>(K.order, null))
    setReady(true)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    write(K.lang, l)
  }, [])
  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c)
    write(K.cur, c)
  }, [])

  const updateCart = useCallback((fn: (c: CartItem[]) => CartItem[]) => {
    setCart((prev) => {
      const next = fn(prev)
      write(K.cart, next)
      return next
    })
  }, [])

  const addItem = useCallback(
    (i: Omit<CartItem, 'id'>) => {
      updateCart((c) => {
        const same = c.find((x) => x.slug === i.slug && x.date === i.date)
        if (same) return c.map((x) => (x === same ? { ...x, guests: Math.min(14, x.guests + i.guests), addons: Array.from(new Set([...x.addons, ...i.addons])) } : x))
        return [...c, { ...i, id: Math.random().toString(36).slice(2, 9) }]
      })
    },
    [updateCart]
  )
  const removeItem = useCallback((id: string) => updateCart((c) => c.filter((x) => x.id !== id)), [updateCart])
  const setGuests = useCallback((id: string, n: number) => updateCart((c) => c.map((x) => (x.id === id ? { ...x, guests: Math.max(1, Math.min(14, n)) } : x))), [updateCart])
  const clearCart = useCallback(() => updateCart(() => []), [updateCart])

  const setPromoCode = useCallback((c: string) => {
    setPromoCodeState(c)
    write(K.promo, c)
  }, [])
  const setProfile = useCallback((p: Profile | null) => {
    setProfileState(p)
    write(K.profile, p)
  }, [])
  const toggleFav = useCallback((slug: string) => {
    setFavs((f) => {
      const next = f.includes(slug) ? f.filter((s) => s !== slug) : [...f, slug]
      write(K.favs, next)
      return next
    })
  }, [])
  const setOrder = useCallback((o: Order | null) => {
    setOrderState(o)
    write(K.order, o)
  }, [])

  const showToast = useCallback((m: string) => {
    setToast(m)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2800)
  }, [])

  const t = useCallback(
    (k: Key, vars?: Record<string, string | number>) => {
      let s = (lang === 'en' ? en[k] : es[k]) ?? k
      if (vars) for (const [a, b] of Object.entries(vars)) s = s.split(`{${a}}`).join(String(b))
      return s
    },
    [lang]
  )
  const loc = useCallback((l: L) => l[lang], [lang])
  const money = useCallback((cents: number) => formatMoney(cents, currency, lang), [currency, lang])

  const subtotal = useMemo(() => cart.reduce((s, i) => s + priceItem(i).total, 0), [cart])
  const promo = useMemo(() => (promoCode ? validatePromo(promoCode, subtotal) : null), [promoCode, subtotal])
  const discount = promo?.discount ?? 0
  const total = Math.max(0, subtotal - discount)

  const value: Ctx = {
    ready,
    lang,
    setLang,
    t,
    loc,
    currency,
    setCurrency,
    money,
    cart,
    addItem,
    removeItem,
    setGuests,
    clearCart,
    promoCode,
    setPromoCode,
    subtotal,
    discount,
    total,
    promo,
    profile,
    setProfile,
    favs,
    toggleFav,
    cartOpen,
    setCartOpen,
    toast,
    showToast,
    order,
    setOrder,
  }
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

export function useStore() {
  const c = useContext(StoreCtx)
  if (!c) throw new Error('useStore must be used inside StoreProvider')
  return c
}
