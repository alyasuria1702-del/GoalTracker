import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'My Goals — Трекер целей',
  description: 'Ставьте цели, достигайте результатов',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
