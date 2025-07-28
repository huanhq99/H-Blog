'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const navItem = { 主页: '/', 博客: '/blog' }

export default function Header() {
  const [hideHeader, setHideHeader] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const halfScreenHeight = window.innerHeight / 2

      if (currentScrollY < halfScreenHeight) {
        setHideHeader(false)
      } else {
        if (currentScrollY > lastScrollY) {
          setHideHeader(true)
        } else {
          setHideHeader(false)
        }
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <header
      className={`
        fixed top-[15px] left-0 right-0 z-[1000]
        bg-white/70 dark:bg-neutral-900/70
        backdrop-saturate-[180%] backdrop-blur-[16px]
        webkit-backdrop-saturate-[180%] webkit-backdrop-blur-[16px]
        px-6 py-2 rounded-[56px]
        transition-all duration-300 ease-[cubic-bezier(0.215,0.61,0.355,1)]
        h-auto min-h-[60px]
        flex items-center
        w-[75%] max-w-[800px]
        mx-auto
        will-change-transform
        ${hideHeader ? 'translate-y-[-150%]' : 'translate-y-0'}
      `}
    >
      <nav className="w-full">
        <div className="nav-links flex gap-2 text-lg justify-center">
          {Object.entries(navItem).map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="hover:bg-zinc-200 hover:text-black hover:rounded-md px-2 py-1"
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
