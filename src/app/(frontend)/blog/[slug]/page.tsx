import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Markdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import type { Metadata } from 'next'
import { TOC } from 'react-markdown-toc/server'
import remarkGfm from 'remark-gfm'

export async function generateMetadata(context: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
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

const slugify = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\u4e00-\u9fa5- ]+/g, '') // 保留中文、英文、空格、短横线
    .replace(/\s+/g, '-') // 空格变为短横线

function calculateReadingTime(markdown: string): number {
  const plainText = markdown
    .replace(/```\s*[\s\S]*?```/g, '') // 去除代码块
    .replace(/`[^`]*`/g, '') // 去除行内代码
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // 去除图片
    .replace(/\[[^\]]*\]\([^)]*\)/g, '') // 去除链接
    .replace(/[#>*_\-~`]+/g, '') // 去除 Markdown 语法字符
    .replace(/\s+/g, '') // 去除多余空白
    .trim()

  const wordCount = plainText.length
  return Math.ceil(wordCount / 255)
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
      <main className="flex-1 sm:px-10 mt-24 markdown-body max-w-full">
        <article className="prose">
          <Link href="/blog" className="inline-block py-2 text-sm mt-4 text-zinc-400">
            <span className="inline-block ml-2">← 所有文章</span>
          </Link>
          <h1>{post.title}</h1>
          <div className="overflow-x-auto scrollbar-hidden">
            <div className="inline-flex min-w-full whitespace-nowrap">
              <div className="text-center p-2 m-2 rounded-lg border bg-zinc-100 flex-shrink-0 max-w-[150px] dark:bg-zinc-800 dark:border-zinc-800">
                <p className="text-xs text-zinc-500 mb-1">最后修改</p>
                <div className="inline-flex items-center text-zinc-500">
                  {new Date(post.updatedAt).toLocaleDateString('zh-CN')}
                </div>
              </div>
              <div className="text-center p-2 m-2 rounded-lg border bg-zinc-100 flex-shrink-0 max-w-[150px] dark:bg-zinc-800 dark:border-zinc-800">
                <p className="text-xs text-zinc-500 mb-1">作者</p>
                <div className="inline-flex items-center text-zinc-500">HuanHQ</div>
              </div>
              <div className="text-center p-2 m-2 rounded-lg border bg-zinc-100 flex-shrink-0 max-w-[150px] dark:bg-zinc-800 dark:border-zinc-800">
                <p className="text-xs text-zinc-500 mb-1">阅读时间</p>
                <div className="inline-flex items-center text-zinc-500">
                  {calculateReadingTime(post.content)} min read
                </div>
              </div>
            </div>
          </div>
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
          <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2({ children }) {
                const text = String(children)
                return <h2 id={slugify(text)}>{children}</h2>
              },
              h3({ children }) {
                const text = String(children)
                return <h3 id={slugify(text)}>{children}</h3>
              },
              h4({ children }) {
                const text = String(children)
                return <h4 id={slugify(text)}>{children}</h4>
              },
              h5({ children }) {
                const text = String(children)
                return <h5 id={slugify(text)}>{children}</h5>
              },
              h6({ children }) {
                const text = String(children)
                return <h6 id={slugify(text)}>{children}</h6>
              },
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
                  <code className={className}>{children}</code>
                )
              },
            }}
          >
            {post.content}
          </Markdown>
        </article>
      </main>
      <aside className="w-full lg:w-1/5 hidden lg:block mt-24 sticky">
        <nav className="toc">
          <TOC markdown={post.content} throttleTime={100} ul="pl-4" li="my-1 text-gray-600" />
        </nav>
      </aside>
    </div>
  )
}
