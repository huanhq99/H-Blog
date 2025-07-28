import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: '文章标题。',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: '文章唯一标识，用于 URL。请尽可能使用英文。',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      admin: {
        description: '文章分类。',
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        description: '文章标签。',
      },
    },
    {
      name: 'featuredImage',
      type: 'text',
      admin: {
        description: '文章封面图片。',
      },
    },
    {
      name: 'excerpt',
      type: 'text',
      admin: {
        description: '文章摘要。',
      },
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'publishedDate',
      type: 'date',
      admin: {
        condition: (_data, siblingData) => {
          return Boolean(siblingData?.published)
        },
      },
    },
  ],
}
