import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | Mithila Makhana — Health, Heritage & Recipes',
  description: 'Read about the health benefits of Makhana, traditional recipes, and the heritage of Mithila superfoods.',
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
