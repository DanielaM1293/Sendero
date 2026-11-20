import { getExp } from './data'

export interface DayInfo {
  date: string
  spots: number
  factor: number
  tag: 'peak' | 'weekend' | null
}

export function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function hash(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Disponibilidad simulada y determinista. Reemplázala por tu base de datos. */
export function dayInfo(slug: string, date: string): DayInfo {
  const exp = getExp(slug)
  if (!exp) throw new Error('unknown experience')
  const d = new Date(date + 'T12:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.floor((d.getTime() - today.getTime()) / 86400000)
  const h = hash(slug + date)
  let spots = exp.maxGroup - (h % (exp.maxGroup + 4))
  if (h % 13 === 0 || diff < 1 || diff > 200) spots = 0
  spots = Math.max(0, Math.min(exp.maxGroup, spots))

  const m = d.getMonth()
  const day = d.getDate()
  const dow = d.getDay()
  const holiday = (m === 11 && day >= 20) || (m === 0 && day <= 6)
  const peakMonth = m === 11 || m === 0 || m === 5 || m === 6
  let factor = 1
  let tag: DayInfo['tag'] = null
  if (holiday) {
    factor = 1.3
    tag = 'peak'
  } else if (peakMonth) {
    factor = 1.18
    tag = 'peak'
  } else if (dow === 0 || dow === 6) {
    factor = 1.1
    tag = 'weekend'
  }
  return { date, spots, factor, tag }
}

export function monthDays(slug: string, month: string) {
  const [y, m] = month.split('-').map(Number)
  const n = new Date(y, m, 0).getDate()
  const out: Record<string, DayInfo> = {}
  for (let i = 1; i <= n; i++) {
    const date = `${y}-${String(m).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    out[date] = dayInfo(slug, date)
  }
  return out
}
