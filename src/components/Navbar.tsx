'use client'
import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  return (
    <nav className="relative z-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-center w-full">
          <Link href="/" className="flex items-center justify-center">
            <Image
              src="/L0g01.png"
              alt="ePulse Logo"
              width={200}
              height={60}
              className="h-16 w-auto cursor-pointer hover:scale-105 transition-transform duration-300"
              priority
            />
          </Link>
        </div>
      </div>
    </nav>
  )
}
