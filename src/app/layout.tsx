import type { Metadata } from 'next'
import { cn } from '@/lib/utils'
import './globals.css'

export const metadata: Metadata = {
  title: "Kanha's Veg Restaurant | Authentic North Indian Vegetarian",
  description:
    "Kanha's Veg Restaurant — Authentic North Indian vegetarian cuisine in Musaffah, Abu Dhabi. Order online for pickup or delivery.",
  openGraph: {
    title: "Kanha's Veg Restaurant",
    description: "Authentic North Indian vegetarian cuisine. Order online for pickup or delivery.",
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={cn('min-h-screen bg-background antialiased')}>
        {children}
      </body>
    </html>
  )
}
