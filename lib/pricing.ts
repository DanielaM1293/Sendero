import { ADDONS, getExp, type L } from './data'
import { dayInfo } from './availability'

export const COP_RATE = Number(process.env.NEXT_PUBLIC_COP_RATE || 4000)

export interface ItemLike {
  slug: string
  date: string
  guests: number
  addons: string[]
}

/** Todos los importes en centavos de USD */
export function priceItem(it: ItemLike) {
  const exp = getExp(it.slug)
  if (!exp) return { unit: 0, base: 0, add: 0, total: 0, tag: null as 'peak' | 'weekend' | null }
  const info = dayInfo(it.slug, it.date)
  const unit = Math.round(exp.priceUSD * 100 * info.factor)
  const base = unit * it.guests
  const add = (it.addons || []).reduce((sum, id) => {
    const a = ADDONS.find((x) => x.id === id)
    if (!a) return sum
    return sum + (a.per === 'person' ? a.price * 100 * it.guests : a.price * 100)
  }, 0)
  return { unit, base, add, total: base + add, tag: info.tag }
}

export const PROMOS: Record<string, { pct?: number; flat?: number; min?: number; label: L }> = {
  SENDERO10: { pct: 10, label: { es: '10% de descuento', en: '10% off' } },
  VIAJA15: { pct: 15, min: 20000, label: { es: '15% en reservas desde US$200', en: '15% off bookings over US$200' } },
  BIENVENIDO: { flat: 2000, label: { es: 'US$20 de bienvenida', en: 'US$20 welcome credit' } },
}

export function validatePromo(code: string, subtotal: number) {
  const key = code.trim().toUpperCase()
  const p = PROMOS[key]
  if (!p) return null
  if (p.min && subtotal < p.min) return null
  const discount = p.pct ? Math.round((subtotal * p.pct) / 100) : Math.min(p.flat || 0, subtotal)
  return { code: key, discount, label: p.label }
}
