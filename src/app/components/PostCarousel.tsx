'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function PostCarousel({ posts }: { posts: any[] }) {
  const duplicatedPosts = [...posts, ...posts] // 🔁 复制内容以实现无缝滚动

  return (
    <div className="overflow-hidden rounded-md">
      <div className="post-carousel-track flex whitespace-nowrap w-max">
        {duplicatedPosts.map((post, index) => {
          const href = `/blog/${post.slug}`

          return (
            <article key={`${post.id}-${index}`} className="flex-shrink-0 w-[445px] mr-4">
              <Link href={href} className="block no-underline text-inherit h-full">
                <Image
                  width={445}
                  height={250}
                  src={post.featuredImage || 'https://img.huan.im/i/2025/05/11/6820505035ca2.png'}
                  alt={post.title}
                  className="w-full aspect-video object-cover mb-2 rounded-md"
                />
                <div className="p-5">
                  <h2 className="font-semibold line-clamp-2">{post.title}</h2>
                </div>
              </Link>
            </article>
          )
        })}
      </div>
    </div>
  )
}
