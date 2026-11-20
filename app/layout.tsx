import type { Metadata, Viewport } from 'next'
import '@fontsource-variable/bricolage-grotesque/wdth.css'
import '@fontsource-variable/instrument-sans/index.css'
import './globals.css'
import { CartDrawer } from '@/components/CartDrawer'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Providers } from '@/components/Providers'

export const metadata: Metadata = {
  title: { default: 'Sendero: experiencias con guías locales en Colombia', template: '%s | Sendero' },
  description: 'Reserva experiencias con guías locales en Colombia. Grupos pequeños, cupos reales y pago seguro.',
}
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#e8efea' },
    { media: '(prefers-color-scheme: dark)', color: '#081416' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <Providers>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  )
}
