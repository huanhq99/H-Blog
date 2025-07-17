// components/TableOfContents.tsx
'use client'

import { useEffect, useState } from 'react'

export type TOCItem = {
  id: string
  text: string
  level: number
}

export default function TableOfContents({ items }: { items: TOCItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = items
        .map((item) => document.getElementById(item.id))
        .filter(Boolean) as HTMLElement[]

      if (headingElements.length === 0) return

      const scrollPosition = window.scrollY + 100 // 100px 提前激活
      
      // 找到当前激活的标题
      let currentId: string | null = null
      for (let i = 0; i < headingElements.length; i++) {
        const el = headingElements[i]
        if (el.offsetTop <= scrollPosition) {
          currentId = el.id
        } else {
          break
        }
      }

      setActiveId(currentId)
    }

    // 添加滚动监听
    window.addEventListener('scroll', handleScroll)
    // 初始执行一次
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [items])

  if (!items.length) return null

  return (
    <nav className="sticky top-8 max-w-full" aria-label="文章目录">
      <div className="max-h-[calc(100vh-4rem)] overflow-y-auto pr-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-2 dark:text-gray-400">目录</h2>
        <ul className="list-none p-0 m-0">
          {items.map(({ id, text, level }) => (
            <li key={id} className={`my-1 break-words ${level === 3 ? 'pl-4' : 'pl-0'}`}>
              <a
                href={`#${id}`}
                className={`inline-block max-w-full py-[1px] font-normal text-[0.9em] leading-6 transition-colors duration-300 ease-in-out no-underline
                  ${
                    activeId === id
                      ? 'text-black dark:text-white font-semibold'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }
                `}
                aria-current={activeId === id ? 'true' : undefined}
                onClick={(e) => {
                  e.preventDefault()
                  const target = document.getElementById(id)
                  if (target) {
                    // 平滑滚动到目标位置
                    window.scrollTo({
                      top: target.offsetTop - 80,
                      behavior: 'smooth'
                    })
                    // 更新 URL 哈希
                    window.history.pushState(null, '', `#${id}`)
                  }
                }}
              >
                {text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}