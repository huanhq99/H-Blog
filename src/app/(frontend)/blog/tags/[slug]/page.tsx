import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Image from 'next/image'
import BlogHeatmap from '@/app/components/BlogHeatmap'
import Link from 'next/link'

export const metadata = {
  title: "博客 - HuanHQ's Blog",
}

export default async function BlogTagsPage(context: { params: Promise<{ slug: string }> }) {
  const payload = await getPayload({ config: configPromise })

  const { slug } = await context.params

  const postsData = await payload.find({
    collection: 'posts',
    depth: 1,
    overrideAccess: false,
    where: {
      'tags.name': {
        equals: slug
      }
    }
  })

  const categoriesData = await payload.find({
    collection: 'categories',
  })

  const tagsData = await payload.find({
    collection: 'tags'
  })

  const categories = categoriesData.docs || []

  const tags = tagsData.docs || []

  const posts = postsData.docs.map(({ content: string, ...rest }) => rest)

  const heatmapData = posts.reduce((acc: Record<string, number>, post) => {
    const date = new Date(post.publishedDate || post.createdAt)
    const monthKey = date.toISOString().slice(0, 7) // YYYY-MM
    acc[monthKey] = (acc[monthKey] || 0) + 1
    return acc
  }, {})

  const heatmapValues = Object.entries(heatmapData).map(([date, count]) => ({
    date,
    count,
  }))

  return (
    <div>
      <h1 className="text-4xl font-bold pt-14 mb-4">标签：{slug}</h1>
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-6/7 lg:pr-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-4 gap-4">
              {posts.map((post: any) => (
                <article key={post.id} className="flex flex-col h-full">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="flex flex-col h-full no-underline text-inherit"
                  >
                    {post.featuredImage && (
                      <div className="relative w-full aspect-video mb-2 rounded-md overflow-hidden">
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
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
                  </Link>
                </article>
              ))}
            </div>
          </div>
          <div className="w-full lg:w-1/4 relitu xl:w-1/4 2xl:w-1/5 3xl:w-1/5 4xl:w-1/5">
            <div className="lg:sticky lg:top-4">
              <div className="bg-bl border border-zinc-200 rounded-lg p-4 mb-4">
                <h2 className="text-lg font-semibold text-zinc-700 mb-2 dark:text-zinc-800">
                  热力图
                </h2>
                <BlogHeatmap data={heatmapValues} />
              </div>
              <div className="bg-bl border border-zinc-200 rounded-lg p-4 mb-4">
                <h2 className="text-lg font-semibold text-zinc-700 mb-2 dark:text-zinc-800">
                  分类
                </h2>
                <div className="flex flex-row flex-wrap space-x-3">
                  {categories.map((category) => (
                    <Link key={category.id} href={`/blog/categories/${category.name}`}>
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-bl border border-zinc-200 rounded-lg p-4 mb-4">
                <h2 className="text-lg font-semibold text-zinc-700 mb-2 dark:text-zinc-800">
                  标签
                </h2>
                <div>
                  {tags.map((tag) => (
                    <Link key={tag.id} href={`/blog/tags/${tag.name}`}>
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
