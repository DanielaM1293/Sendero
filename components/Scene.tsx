'use client'

import { useId, type ReactNode } from 'react'
import { peaks, ridge, rng } from '@/lib/art'
import type { SceneKind } from '@/lib/data'

/** Ilustraciones generativas de cada experiencia (sin fotos externas). */
export function Scene({ kind, className = '' }: { kind: SceneKind; className?: string }) {
  const uid = useId().replace(/:/g, '')
  const g = `g${uid}`
  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" className={className} role="img" aria-hidden="true">
      {SCENES[kind](g)}
    </svg>
  )
}

const Sky = ({ id, a, b, c }: { id: string; a: string; b: string; c?: string }) => (
  <>
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={a} />
        {c && <stop offset=".55" stopColor={c} />}
        <stop offset="1" stopColor={b} />
      </linearGradient>
    </defs>
    <rect width="800" height="600" fill={`url(#${id})`} />
  </>
)

function Palm({ x, y, h, color, lean = 0 }: { x: number; y: number; h: number; color: string; lean?: number }) {
  const tx = x + lean
  const ty = y - h
  return (
    <g>
      <path d={`M${x} ${y} Q${x + lean / 2} ${y - h / 2} ${tx} ${ty}`} stroke="#b89a6e" strokeWidth={h > 200 ? 7 : 4} fill="none" strokeLinecap="round" />
      {[-60, -30, 0, 30, 60].map((a) => (
        <ellipse key={a} cx={tx + Math.sin((a * Math.PI) / 180) * 26} cy={ty - Math.cos((a * Math.PI) / 180) * 6 + 6} rx="26" ry="4.5" fill={color} transform={`rotate(${a} ${tx} ${ty})`} />
      ))}
    </g>
  )
}

const SCENES: Record<SceneKind, (id: string) => ReactNode> = {
  cocora: (id) => {
    const r = rng(11)
    return (
      <>
        <Sky id={id} a="#a9d3c4" b="#f6e9c9" />
        <circle cx="590" cy="170" r="58" fill="#fff6d8" opacity=".8" />
        <path d={ridge(3, 360, 110, 7)} fill="#8fbf9c" />
        <path d={ridge(7, 430, 110, 6)} fill="#5e9a77" />
        <rect y="330" width="800" height="90" fill="#fff" opacity=".35" />
        <path d={ridge(5, 500, 90, 6)} fill="#3d7a5e" />
        <path d={ridge(9, 580, 70, 6)} fill="#235a47" />
        {Array.from({ length: 9 }).map((_, i) => {
          const x = 90 + i * 82 + r() * 30
          const h = 190 + r() * 130
          return <Palm key={i} x={x} y={560 - r() * 30} h={h} color="#1c4a3a" lean={(r() - 0.5) * 22} />
        })}
        <rect y="450" width="800" height="150" fill="#fff" opacity=".12" />
      </>
    )
  },
  tayrona: (id) => (
    <>
      <Sky id={id} a="#ffcf9b" b="#ffe9c4" c="#ffb0a0" />
      <circle cx="560" cy="300" r="64" fill="#fff0c4" />
      <rect y="320" width="800" height="150" fill="#1aa7b0" />
      <rect y="320" width="800" height="22" fill="#fff" opacity=".35" />
      {[360, 395, 430].map((y, i) => (
        <path key={y} d={`M${60 + i * 90} ${y} q60 -12 120 0 t120 0 t120 0`} stroke="#d9fbf5" strokeWidth="3" fill="none" opacity=".7" />
      ))}
      <path d={ridge(4, 340, 60, 5)} fill="#2e7d6a" opacity=".85" />
      <path d="M0 470 Q250 430 520 470 T800 450 V600 H0Z" fill="#f0cf94" />
      <ellipse cx="170" cy="500" rx="120" ry="70" fill="#8a8f98" />
      <ellipse cx="120" cy="470" rx="70" ry="48" fill="#a2a8b0" />
      <ellipse cx="660" cy="520" rx="90" ry="46" fill="#7c828b" />
      <Palm x={330} y={540} h={280} color="#1e6a4c" lean={40} />
      <Palm x={420} y={560} h={200} color="#2a8059" lean={-25} />
      <path d="M0 560 Q200 540 400 566 T800 556 V600 H0Z" fill="#e2bd7e" />
    </>
  ),
  guatape: (id) => (
    <>
      <Sky id={id} a="#89c4ee" b="#e3f3fb" />
      {[[140, 120, 90], [520, 90, 110], [660, 170, 70]].map(([x, y, w], i) => (
        <g key={i} fill="#fff" opacity=".85">
          <ellipse cx={x} cy={y} rx={w} ry="20" />
          <ellipse cx={x + 30} cy={y - 14} rx={w * 0.55} ry="18" />
        </g>
      ))}
      <path d="M0 350 Q200 300 400 340 T800 320 V600 H0Z" fill="#6fae8a" />
      <rect y="380" width="800" height="220" fill="#2f95c3" />
      {[430, 470, 520].map((y, i) => (
        <path key={y} d={`M${20 + i * 40} ${y} q50 -8 100 0 t100 0 t100 0 t100 0 t100 0`} stroke="#bfe8f7" strokeWidth="3" fill="none" opacity=".65" />
      ))}
      {/* El Peñol */}
      <path d="M470 400 C470 250 560 180 640 190 C720 200 770 300 790 400Z" fill="#6d6a68" />
      <path d="M560 400 C560 280 620 230 680 240 C730 250 760 330 770 400Z" fill="#8a8582" />
      <path d="M610 395 l18 -34 l-18 -22 l22 -22 l-18 -22" stroke="#f3ede6" strokeWidth="4" fill="none" strokeLinejoin="round" />
      {/* Islas */}
      <path d="M60 430 q60 -64 130 0Z" fill="#3f8f62" />
      <path d="M250 470 q40 -44 90 0Z" fill="#2f7a54" />
      {/* Lancha */}
      <g transform="translate(330 520)">
        <path d="M0 0 h110 l-14 22 h-82z" fill="#ff4d6d" />
        <rect x="34" y="-30" width="40" height="30" fill="#fff" />
        <rect x="30" y="-36" width="48" height="8" fill="#ffc300" />
      </g>
    </>
  ),
  tatacoa: (id) => {
    const r = rng(21)
    return (
      <>
        <Sky id={id} a="#0b1030" b="#4a2a63" c="#1d2a63" />
        {Array.from({ length: 70 }).map((_, i) => (
          <circle key={i} cx={r() * 800} cy={r() * 330} r={r() * 1.8 + 0.4} fill="#fff" opacity={0.4 + r() * 0.6} />
        ))}
        <ellipse cx="400" cy="150" rx="420" ry="46" fill="#cbb8ff" opacity=".18" transform="rotate(-22 400 150)" />
        <ellipse cx="400" cy="150" rx="320" ry="20" fill="#fff" opacity=".12" transform="rotate(-22 400 150)" />
        <circle cx="640" cy="110" r="30" fill="#f6efd8" />
        <path d={peaks(2, 380, 120, 12)} fill="#a8553a" />
        <path d={peaks(5, 450, 120, 9)} fill="#c76a43" />
        <path d={peaks(8, 520, 100, 8)} fill="#8f3f2c" />
        <path d={peaks(12, 600, 70, 7)} fill="#5e2a22" />
        <g transform="translate(520 470)">
          <path d="M0 40 V10 L40 -18 L80 10 V40Z" fill="#2a1a22" />
          <rect x="30" y="14" width="18" height="18" fill="#ffd36a" />
        </g>
      </>
    )
  },
  cartagena: (id) => {
    const r = rng(31)
    const cols = ['#ff6b8b', '#ffbe55', '#2ec4b6', '#ff9f68', '#8f7cf0', '#ffe066', '#4cc9f0']
    let x = -10
    const blocks: ReactNode[] = []
    let i = 0
    while (x < 800) {
      const w = 80 + r() * 50
      const h = 150 + r() * 120
      blocks.push(
        <g key={i++}>
          <rect x={x} y={470 - h} width={w} height={h} fill={cols[Math.floor(r() * cols.length)]} />
          <rect x={x} y={470 - h} width={w} height="10" fill="#000" opacity=".12" />
          {[0, 1].map((c) =>
            [0, 1].map((rr) => (
              <rect key={`${c}${rr}`} x={x + 14 + c * (w / 2 - 6)} y={470 - h + 30 + rr * 56} width="20" height="32" fill="#3a2142" opacity=".75" />
            ))
          )}
          <rect x={x + 6} y={470 - h + 70} width={w - 12} height="5" fill="#fff" opacity=".5" />
        </g>
      )
      x += w + 4
    }
    return (
      <>
        <Sky id={id} a="#5a3f8f" b="#ffc07a" c="#f06c8f" />
        <circle cx="400" cy="350" r="110" fill="#ffd98a" opacity=".9" />
        {blocks}
        <rect y="470" width="800" height="40" fill="#b68a63" />
        {Array.from({ length: 14 }).map((_, k) => (
          <rect key={k} x={k * 60 + 10} y="462" width="34" height="12" fill="#c9a07a" />
        ))}
        <rect y="510" width="800" height="90" fill="#1d5a7a" />
        <path d="M0 540 q50 -10 100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0" stroke="#ffd6a3" strokeWidth="3" fill="none" opacity=".5" />
      </>
    )
  },
  cafe: (id) => {
    const rows = (base: number, color: string, seed: number) => {
      const r = rng(seed)
      return Array.from({ length: 10 }).map((_, i) => (
        <path key={i} d={`M${-20 + i * 14} ${base + i * 14 + 20} Q${300 + r() * 50} ${base - 40 + i * 14} 820 ${base + 10 + i * 14}`} stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" opacity=".8" />
      ))
    }
    const r = rng(9)
    return (
      <>
        <Sky id={id} a="#ffe2b3" b="#fff6e0" c="#ffd0a0" />
        <circle cx="200" cy="170" r="70" fill="#fff3c8" />
        <path d={ridge(14, 330, 100, 6)} fill="#a9c585" />
        <path d={ridge(17, 400, 90, 6)} fill="#78a65f" />
        <path d={ridge(6, 470, 90, 5)} fill="#4d8b47" />
        {rows(430, '#2d6a3a', 4)}
        <path d={ridge(22, 560, 80, 5)} fill="#2f6e3e" />
        {rows(520, '#1d4f2c', 8)}
        {Array.from({ length: 26 }).map((_, i) => (
          <circle key={i} cx={40 + r() * 720} cy={470 + r() * 110} r="4.5" fill="#e0314b" />
        ))}
        <g transform="translate(560 330)">
          <rect width="64" height="38" fill="#fff4e4" />
          <path d="M-8 2 L32 -28 L72 2Z" fill="#c0503a" />
          <rect x="26" y="14" width="14" height="24" fill="#6b3a2a" />
        </g>
      </>
    )
  },
}
