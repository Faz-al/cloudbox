export const allPostsQuery = `
*[_type == "post"] | order(publishedAt desc){
  title,
  excerpt,
  seoTitle,
  seoDescription,
  publishedAt,
  mainImage,
  "slug": slug.current
}
`

export const postBySlugQuery = `
*[_type == "post" && slug.current == $slug][0]{
  title,
  excerpt,
  body,
  seoTitle,
  seoDescription,
  publishedAt,
  mainImage,
  ogImage,
  faq,
  "slug": slug.current
}
`