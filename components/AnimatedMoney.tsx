'use client'

import { animate, useMotionValue } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useStore } from '@/lib/store'

/** Cuenta suavemente hasta el nuevo importe (en centavos de USD). */
export function AnimatedMoney({ cents, className }: { cents: number; className?: string }) {
  const { money } = useStore()
  const mv = useMotionValue(cents)
  const ref = useRef<HTMLSpanElement>(null)
  const moneyRef = useRef(money)
  moneyRef.current = money

  useEffect(() => {
    const unsub = mv.on('change', (v) => {
      if (ref.current) ref.current.textContent = moneyRef.current(Math.round(v))
    })
    const c = animate(mv, cents, { duration: 0.6, ease: [0.22, 1, 0.36, 1] })
    return () => {
      unsub()
      c.stop()
    }
  }, [cents, mv])

  useEffect(() => {
    if (ref.current) ref.current.textContent = money(Math.round(mv.get()))
  }, [money, mv])

  return (
    <span ref={ref} className={className}>
      {money(cents)}
    </span>
  )
}
