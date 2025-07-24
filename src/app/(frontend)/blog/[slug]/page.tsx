import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Markdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {vscDarkPlus} from 'react-syntax-highlighter/dist/esm/styles/prism'
import type {Metadata} from 'next'

export async function generateMetadata(context: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await context.params

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    depth: 2,
  })

  const post = result.docs?.[0]

  if (!post)
    return {
      title: '文章未找到 - Title',
    }

  return {
    title: `${post.title} - HuanHQ's Blog`,
  }
}

export default async function BlogPostPage(context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    depth: 2,
  })

  const post = result.docs?.[0]

  if (!post) return notFound()

  return (
    <div className="flex flex-col lg:flex-row">
      <aside className="w-full lg:w-1/5 hidden lg:block mt-24 pr-6"></aside>
      <main className="flex-1 sm:px-10 mt-24 prose max-w-full">
        <article className="prose">
          <Link href="/blog" className="inline-block py-2 text-sm mt-4 text-zinc-400">
            <span className="inline-block ml-2">← 所有文章</span>
          </Link>
          <h1>{post.title}</h1>
          <div className="overflow-x-auto scrollbar-hidden">
            <div className="inline-flex min-w-full whitespace-nowrap">
              <div className="text-center p-2 m-2 rounded-lg border bg-zinc-100 flex-shrink-0 max-w-[150px] dark:bg-zinc-800 dark:border-zinc-800">
                <p className="text-xs text-zinc-500 mb-1">最后修改</p>
                <div className="inline-flex items-center">
                  {new Date(post.updatedAt).toLocaleDateString('zh-CN')}
                </div>
              </div>
              <div className="text-center p-2 m-2 rounded-lg border bg-zinc-100 flex-shrink-0 max-w-[150px] dark:bg-zinc-800 dark:border-zinc-800">
                <p className="text-xs text-zinc-500 mb-1">作者</p>
                <div className="inline-flex items-center">HuanHQ</div>
              </div>
            </div>
          </div>
          {typeof post.featuredImage === 'object' && post.featuredImage?.url && (
            <div className="relative w-full aspect-video mb-2 rounded-md overflow-hidden">
              <Image
                src={post.featuredImage.url}
                alt={post.featuredImage.alt || post.title}
                fill
                className="object-cover rounded-md"
              />
            </div>
          )}
          <Markdown
            children={post.content}
            components={{
              code({ node, className, children }) {
                const match = /language-(\w+)/.exec(className || '')
                const code = String(children).replace(/\n$/, '')

                return match ? (
                  <SyntaxHighlighter
                    language={match[1]}
                    style={vscDarkPlus}
                    PreTag="div"
                    className="rounded-lg shadow"
                  >
                    {code}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className}>
                        {children}
                  </code>
                )
              }
            }}
          />
        </article>
      </main>
      <aside className="w-full lg:w-1/5 hidden lg:block mt-24">TOC (todo)</aside>
    </div>
  )
}
