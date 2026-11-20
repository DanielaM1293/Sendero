import Stripe from 'stripe'
import { dayInfo } from './availability'
import { ADDONS, getExp } from './data'
import { priceItem, validatePromo } from './pricing'

export interface RawItem {
  slug: string
  date: string
  guests: number
  addons?: string[]
}

export const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null

/** Valida el carrito en el servidor y recalcula los precios. Nunca confíes en el total del cliente. */
export function quote(items: RawItem[], promoCode?: string) {
  if (!Array.isArray(items) || items.length === 0 || items.length > 10) return { error: 'empty' as const }
  const clean: Required<RawItem>[] = []
  for (const it of items) {
    const exp = getExp(it.slug)
    if (!exp || !/^\d{4}-\d{2}-\d{2}$/.test(it.date)) return { error: 'invalid' as const }
    const guests = Math.floor(Number(it.guests))
    const info = dayInfo(it.slug, it.date)
    if (!(guests >= 1) || guests > info.spots) return { error: 'availability' as const }
    const addons = (it.addons ?? []).filter((a) => ADDONS.some((x) => x.id === a))
    clean.push({ slug: it.slug, date: it.date, guests, addons })
  }
  const subtotal = clean.reduce((s, i) => s + priceItem(i).total, 0)
  const promo = promoCode ? validatePromo(promoCode, subtotal) : null
  const discount = promo?.discount ?? 0
  return { items: clean, subtotal, discount, total: Math.max(0, subtotal - discount), promo: promo?.code }
}

const store = globalThis as unknown as { __orders?: Map<string, unknown> }
export const orders = (store.__orders ??= new Map())

export function newRef() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let s = ''
  for (let i = 0; i < 6; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)]
  return 'SND-' + s
}
