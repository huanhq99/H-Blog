import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import Link from 'next/link'
import Image from 'next/image'
import { jsxConverter } from '@/app/components/RichText/converters'

export async function generateMetadata(context: { params: Promise<{ slug: string }> }) {
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
    title: `${post.title} - Title`,
  }
}

// 生成标题ID的工具函数
const generateHeadingId = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\u4e00-\u9fa5-]/g, '')
    .replace(/^-+|-+$/g, '');
};

// 从节点提取文本内容
const extractTextFromNode = (node: any): string => {
  if (node?.text) return node.text;
  if (node?.children) {
    return node.children.map((child: any) => extractTextFromNode(child)).join('');
  }
  return '';
};

function extractTOC(content: SerializedEditorState) {
  const toc: { id: string; text: string; level: number }[] = []

  const visit = (nodes: any[]) => {
    nodes.forEach((node) => {
      if (node.type === 'heading' && (node.tag === 'h2' || node.tag === 'h3')) {
        const text = extractTextFromNode(node);
        if (!text) return;
        
        const id = generateHeadingId(text)
        toc.push({ id, text, level: node.tag === 'h2' ? 2 : 3 })
      }
      if (node.children) {
        visit(node.children)
      }
    })
  }

  if (content?.root?.children) {
    visit(content.root.children)
  }

  return toc
}

function TableOfContents({ content }: { content: SerializedEditorState }) {
  const items = extractTOC(content)

  if (!items.length) return null

  return (
    <div className="sticky top-28 text-sm">
      <h3 className="text-gray-500 font-bold mb-3">目录</h3>
      <ul className="space-y-2">
        {items.map(({ id, text, level }) => (
          <li key={id} className={level === 3 ? 'pl-4' : ''}>
            <a href={`#${id}`} className="text-blue-600 hover:underline">
              {text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
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
            <span className="inline-block ml-2">所有文章</span>
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

          <RichText 
            data={post.content}
            converters={jsxConverter}
          />
        </article>
      </main>
      <aside className="w-full lg:w-1/5 hidden lg:block mt-24">
        <TableOfContents content={post.content} />
      </aside>
    </div>
  )
}