import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ферма Лычкиных — Система заявок',
  description: 'Оформление и управление заявками на поставку мяса птицы',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
