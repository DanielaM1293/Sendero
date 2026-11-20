import type { Metadata } from 'next'
import { Confirmation } from '@/components/Confirmation'

export const metadata: Metadata = { title: 'Reserva confirmada' }

export default function Page() {
  return <Confirmation />
}
