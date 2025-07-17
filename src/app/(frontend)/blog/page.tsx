import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Image from 'next/image'

export const metadata = {
  title: '博客 - HuanHQ\'s Blog',
}

export default async function BlogPage() {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    depth: 1,
    overrideAccess: false,
  })

  const posts = result.docs

  return (
    <div>
      <h1 className="text-4xl font-bold pt-14 mb-4">博客</h1>
      <div className="container mx-auto">
        <p className="mb-10">沉淀下来的知识才有意义，笔记会在未来的某个时刻带来价值</p>
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-6/7 lg:pr-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-4 gap-4">
              {posts.map((post: any) => (
                <article key={post.id} className="flex flex-col h-full">
                  <a
                    href={`/blog/${post.slug}`}
                    className="flex flex-col h-full no-underline text-inherit"
                  >
                    {post.featuredImage?.url && (
                      <div className="relative w-full aspect-video mb-2 rounded-md overflow-hidden">
                        <Image
                          src={post.featuredImage.url}
                          alt={post.featuredImage.alt || post.title}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <time
                        dateTime={new Date(post.publishedDate).toString()}
                        className="text-xs text-gray-500 mt-1"
                      >
                        {new Date(post.publishedDate).toLocaleDateString('zh-CN')}
                      </time>
                      <h2 className="font-semibold line-clamp-2">{post.title}</h2>
                      <p className="mt-2 text-sm flex-grow">{post.excerpt}</p>
                    </div>
                  </a>
                </article>
              ))}
            </div>
          </div>
          <div className="w-full lg:w-1/4 relitu xl:w-1/4 2xl:w-1/5 3xl:w-1/5 4xl:w-1/5">
              <div className="lg:sticky lg:top-4">
                <div className="bg-bl border border-zinc-200 rounded-lg p-4 mb-4">
                  <h2 className="relitumingzi text-lg font-semibold text-zinc-700 mb-2 dark:text-zinc-800"></h2>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}
