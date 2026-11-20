import { COP_RATE } from './pricing'

export type Lang = 'es' | 'en'
export type Currency = 'USD' | 'COP'

export function formatMoney(cents: number, cur: Currency, lang: Lang) {
  if (cur === 'COP') {
    const v = Math.round(((cents / 100) * COP_RATE) / 1000) * 1000
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v)
  }
  const whole = cents % 100 === 0
  return new Intl.NumberFormat(lang === 'es' ? 'es-CO' : 'en-US', {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'code',
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: 2,
  })
    .format(cents / 100)
    .replace(/USD\s?/, 'US$')
    .replace(/ /g, ' ')
}

export function formatDate(date: string, lang: Lang, opts?: Intl.DateTimeFormatOptions) {
  const d = new Date(date + 'T12:00:00')
  return new Intl.DateTimeFormat(lang === 'es' ? 'es-CO' : 'en-US', opts ?? { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }).format(d)
}

export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
