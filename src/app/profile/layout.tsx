import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Profile | Mithila Makhana',
  description: 'Manage your Mithila Makhana account, addresses, and preferences.',
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children
}
