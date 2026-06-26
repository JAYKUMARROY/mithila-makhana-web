import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login | Mithila Makhana',
  description: 'Sign in to your Mithila Makhana account to track orders, manage your profile, and enjoy a seamless shopping experience.',
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
