import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Order History | Mithila Makhana',
  description: 'View your past orders and track current shipments from Mithila Makhana.',
}

export default function OrderHistoryLayout({ children }: { children: React.ReactNode }) {
  return children
}
