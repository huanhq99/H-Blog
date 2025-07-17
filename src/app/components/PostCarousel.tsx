// components/PostCarousel.tsx
'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'

export default function PostCarousel({ posts }: { posts: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let scroll = 0
    const step = 1
    const halfScroll = container.scrollWidth / 2

    const interval = setInterval(() => {
      container.scrollLeft += step
      scroll += step

      if (scroll >= halfScroll) {
        container.scrollLeft = 0
        scroll = 0
      }
    }, 16)

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      ref={containerRef}
      className="overflow-x-auto whitespace-nowrap scroll-smooth scrollbar-hide px-4"
    >
      {posts.map((post, index) => {
        const imageUrl = post.featuredImage?.url || '/placeholder.png'
        const href = `/blog/${post.slug}` // 👈 文章详情页链接

        return (
          <Link
            href={href}
            key={post.id + '-' + index}
            className="inline-block w-64 mx-3 bg-white dark:bg-gray-800 rounded-lg shadow-md cursor-pointer"
          >
            <img
              src={imageUrl}
              alt={post.featuredImage?.alt || post.title}
              className="w-full aspect-video object-cover mb-2 rounded-md"
            />
            <h3 className="text-sm font-semibold text-center text-gray-800 dark:text-white px-2 pb-4">
              {post.title}
            </h3>
          </Link>
        )
      })}
    </div>
  )
}
