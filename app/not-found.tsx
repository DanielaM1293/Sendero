'use client'

import Link from 'next/link'
import { useStore } from '@/lib/store'

export default function NotFound() {
  const { t } = useStore()
  return (
    <section className="grid min-h-[80svh] place-items-center px-6 pt-24 text-center">
      <div>
        <svg width="220" height="90" viewBox="0 0 220 90" fill="none" className="mx-auto text-muted" aria-hidden="true">
          <path d="M6 80 C50 80 40 20 100 44 S170 70 214 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeDasharray="0.1 12" />
          <path d="M200 -2 l28 28 M228 -2 l-28 28" stroke="rgb(var(--brand))" strokeWidth="5" strokeLinecap="round" transform="translate(-26 4) scale(.8)" />
        </svg>
        <h1 className="h-display mt-8 text-5xl font-bold sm:text-7xl">{t('nf.title')}</h1>
        <p className="mt-4 text-muted">{t('nf.sub')}</p>
        <Link href="/" className="btn-primary mt-8">
          {t('nf.cta')}
        </Link>
      </div>
    </section>
  )
}
