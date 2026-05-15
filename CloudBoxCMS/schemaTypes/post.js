export default {
  name: 'post',
  title: 'Post',
  type: 'document',

  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },

    {
  name: 'slug',
  title: 'Slug',
  type: 'slug',

  options: {
    source: 'title',
    maxLength: 96,

    isUnique: async (slug, context) => {
      const { document, getClient } = context

      const client = getClient({ apiVersion: '2025-01-01' })

      const id = document._id.replace(/^drafts\./, '')

      const params = {
        draft: `drafts.${id}`,
        published: id,
        slug
      }

      const query = `!defined(*[
        !(_id in [$draft, $published]) &&
        slug.current == $slug
      ][0]._id)`

      return await client.fetch(query, params)
    }
  },

  validation: Rule => Rule.required()
},

    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text'
    },

    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime'
    },

    {
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string'
    },

    {
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text'
    },

    {
  name: 'mainImage',
  title: 'Main Image',
  type: 'image',

  options: {
    hotspot: true
  },

  fields: [
    {
      name: 'alt',
      title: 'Alt Text',
      type: 'string',

      validation: Rule =>
        Rule.required()
    }
  ]
},

{
  name: 'ogImage',
  title: 'OG Image',

  type: 'image',

  options: {
    hotspot: true
  },

  fields: [
    {
      name: 'alt',
      title: 'Alt Text',
      type: 'string'
    }
  ]
},

{
  name: 'faq',
  title: 'FAQ',
  type: 'array',
  of: [
    {
      type: 'object',
      fields: [
        {
          name: 'question',
          title: 'Question',
          type: 'string'
        },
        {
          name: 'answer',
          title: 'Answer',
          type: 'text'
        }
      ]
    }
  ]
},

    {
  name: 'body',
  title: 'Body',
  type: 'array',

  of: [
    {
      type: 'block'
    },

    {
      type: 'image',

      options: {
        hotspot: true
      },

      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string'
        },

        {
          name: 'caption',
          title: 'Caption',
          type: 'string'
        }
      ]
    }
  ]
}
  ]
}