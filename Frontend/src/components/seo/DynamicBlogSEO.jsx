import { Helmet } from "react-helmet-async";

import { urlFor } from "../../sanity/image";

export default function DynamicBlogSEO({ post }) {
  const canonicalUrl = `https://safevault.in/blog/${post.slug}`;

  const imageUrl = post.ogImage
    ? urlFor(post.ogImage).width(1200).url()
    : post.mainImage
    ? urlFor(post.mainImage).width(1200).url()
    : "https://safevault.in/og-default.jpg";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",

    headline: post.seoTitle || post.title,

    description:
      post.seoDescription || post.excerpt,

    image: [imageUrl],

    author: {
      "@type": "Organization",
      name: "SafeVault"
    },

    publisher: {
  "@type": "Organization",
  name: "SafeVault",

  logo: {
    "@type": "ImageObject",
    url: "https://safevault.in/logo.png"
  }
},

    datePublished: post.publishedAt,

    mainEntityOfPage: canonicalUrl
  };

  const faqSchema = post.faq?.length
    ? {
        "@context": "https://schema.org",

        "@type": "FAQPage",

        mainEntity: post.faq.map((item) => ({
          "@type": "Question",

          name: item.question,

          acceptedAnswer: {
            "@type": "Answer",

            text: item.answer
          }
        }))
      }
    : null;

  return (
    <Helmet>

      {/* BASIC SEO */}

      <title>
        {post.seoTitle || post.title}
      </title>

      <meta
        name="description"
        content={
          post.seoDescription || post.excerpt
        }
      />

      {/* CANONICAL */}

      <link
        rel="canonical"
        href={canonicalUrl}
      />

      {/* OPEN GRAPH */}

      <meta property="og:type" content="article" />

      <meta
        property="og:title"
        content={post.seoTitle || post.title}
      />

      <meta
        property="og:description"
        content={
          post.seoDescription || post.excerpt
        }
      />

      <meta
        property="og:url"
        content={canonicalUrl}
      />

      <meta
        property="og:image"
        content={imageUrl}
      />

      {/* TWITTER */}

      <meta
        name="twitter:card"
        content="summary_large_image"
      />

      <meta
        name="twitter:title"
        content={post.seoTitle || post.title}
      />

      <meta
        name="twitter:description"
        content={
          post.seoDescription || post.excerpt
        }
      />

      <meta
        name="twitter:image"
        content={imageUrl}
      />

      {/* ARTICLE SCHEMA */}

      <script type="application/ld+json">
        {JSON.stringify(articleSchema)}
      </script>

      {/* FAQ SCHEMA */}

      {faqSchema && (
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      )}

    </Helmet>
  );
}