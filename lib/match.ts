import { EXPERIENCES, type Group, type Pace, type Tag } from './data'

const order: Record<Pace, number> = { slow: 0, medium: 1, fast: 2 }

export function rank(vibe: Tag, pace: Pace, group: Group) {
  return EXPERIENCES.map((e) => {
    let s = 40
    const why: string[] = []
    if (e.tags.includes(vibe)) {
      s += 34
      why.push('vibe')
    }
    if (e.pace === pace) {
      s += 16
      why.push('pace')
    } else if (Math.abs(order[e.pace] - order[pace]) === 1) s += 8
    if (group === 'family') {
      if (e.difficulty === 1) {
        s += 10
        why.push('family')
      } else if (e.difficulty === 3) s -= 10
    }
    if (group === 'friends' && e.maxGroup >= 10) {
      s += 6
      why.push('friends')
    }
    if (group === 'couple' && e.maxGroup <= 10) {
      s += 6
      why.push('couple')
    }
    if (group === 'solo' && e.difficulty <= 2) s += 4
    return { exp: e, score: Math.min(98, s), why }
  }).sort((a, b) => b.score - a.score)
}
