'use client'

import { ThemeProvider } from 'next-themes'
import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import type { ReactNode } from 'react'
import { StoreProvider, useStore } from '@/lib/store'

function Toast() {
  const { toast } = useStore()
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex justify-center px-4">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast}
            initial={{ y: 30, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-bg shadow-2xl"
          >
            <Check size={16} className="text-lagoon" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
      <StoreProvider>
        {children}
        <Toast />
      </StoreProvider>
    </ThemeProvider>
  )
}
