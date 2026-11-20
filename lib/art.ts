export function rng(seed: number) {
  let s = seed >>> 0 || 1
  return () => {
    s ^= s << 13
    s >>>= 0
    s ^= s >>> 17
    s ^= s << 5
    s >>>= 0
    return s / 4294967296
  }
}

/** Colinas suaves */
export function ridge(seed: number, base: number, amp: number, steps = 8, w = 800, h = 600) {
  const r = rng(seed)
  const pts: [number, number][] = []
  for (let i = 0; i <= steps; i++) pts.push([(i / steps) * w, base - r() * amp])
  let d = `M0 ${h} L0 ${pts[0][1].toFixed(1)}`
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1]
    const [x1, y1] = pts[i]
    const cx = (x0 + x1) / 2
    d += ` C${cx.toFixed(1)} ${y0.toFixed(1)} ${cx.toFixed(1)} ${y1.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`
  }
  return d + ` L${w} ${h} Z`
}

/** Picos irregulares */
export function peaks(seed: number, base: number, amp: number, n = 10, w = 800, h = 600) {
  const r = rng(seed)
  let d = `M0 ${h} L0 ${base}`
  for (let i = 1; i <= n; i++) {
    const x = (i / n) * w
    const y = i % 2 ? base - amp * (0.4 + r() * 0.6) : base - amp * r() * 0.35
    d += ` L${x.toFixed(1)} ${y.toFixed(1)}`
  }
  return d + ` L${w} ${h} Z`
}
