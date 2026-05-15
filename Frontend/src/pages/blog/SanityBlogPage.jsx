import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import BlogLayout from '../../components/BlogLayout'

import { sanityClient } from '../../sanity/client'
import { urlFor } from '../../sanity/image'
import { postBySlugQuery } from '../../sanity/queries'
import DynamicBlogSEO from '../../components/seo/DynamicBlogSEO'

import PortableTextRenderer from '../../components/blog/PortableTextRenderer'

export default function SanityBlogPage() {
  const { slug } = useParams()

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPost() {
      try {
        const data = await sanityClient.fetch(
          postBySlugQuery,
          { slug }
        )

        setPost(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  if (loading) {
    return (
      <div className="py-20 text-center">
        Loading...
      </div>
    )
  }

  if (!post) {
    return (
      <div className="py-20 text-center">
        Post not found.
      </div>
    )
  }

  return (
    <>
      <DynamicBlogSEO post={post} />

      <BlogLayout
        title={post.title}
        desc={post.excerpt}
      >

        {post.mainImage && (
  <img
    src={urlFor(post.mainImage).width(1200).url()}
    alt={
  post.mainImage?.alt ||
  post.title
}
    className="rounded-2xl mb-10 w-full"
  />
)}

        <div className="space-y-6">
          <PortableTextRenderer value={post.body} />
          {post.faq?.length > 0 && (
  <section className="space-y-6 mt-12">
    <h2 className="text-3xl font-semibold">
      Frequently Asked Questions
    </h2>

    {post.faq.map((item, index) => (
      <div key={index}>
        <h3 className="font-semibold text-lg">
          {item.question}
        </h3>

        <p className="text-gray-600 mt-2">
          {item.answer}
        </p>
      </div>
    ))}
  </section>
)}
        </div>
      </BlogLayout>
    </>
  )
}