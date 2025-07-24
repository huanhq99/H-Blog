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
        description: '页面标题。',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: '页面唯一标识，用于 URL。请尽可能使用英文。',
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
  ],
}
