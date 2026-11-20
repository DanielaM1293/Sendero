'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { useStore } from '@/lib/store'

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const { t } = useStore()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const dark = mounted && resolvedTheme === 'dark'

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next = dark ? 'light' : 'dark'
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!doc.startViewTransition || reduce) return setTheme(next)
    const x = e.clientX
    const y = e.clientY
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    const tr = doc.startViewTransition(() => setTheme(next))
    tr.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 650, easing: 'cubic-bezier(.22,1,.36,1)', pseudoElement: '::view-transition-new(root)' }
      )
    })
  }

  return (
    <button onClick={toggle} aria-label={t('theme.toggle')} className={`grid h-10 w-10 place-items-center rounded-full transition hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${className}`}>
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
