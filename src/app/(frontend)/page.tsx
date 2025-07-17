// app/page.tsx
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import PostCarousel from '@/app/components/PostCarousel'

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    depth: 1, // 👈 必须有，才能取到 featuredImage.url
    limit: 4,
    sort: '-createdAt',
  })

  const posts = result.docs

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center text-center pt-[20vh]">
      <h1 className="text-5xl font-bold mb-12">Hi! 👋 I am HuanHQ!</h1>

      <div className="w-full max-w-7xl">
        <PostCarousel posts={[...posts, ...posts]} />
      </div>
    </div>
  )
}
