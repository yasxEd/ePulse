import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ePulse',
  description: 'Test and improve your typing speed with our interactive keyboard visualization.',
  icons: {
    icon: [
      { url: '/L0g01.png' },
      { url: '/L0g01.png', sizes: '16x16', type: 'image/png' },
      { url: '/L0g01.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/L0g01.png',
    apple: '/L0g01.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}