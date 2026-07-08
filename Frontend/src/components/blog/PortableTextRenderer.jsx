import { PortableText } from '@portabletext/react'

import { urlFor } from '../../sanity/image'

const components = {
  types: {
    image: ({ value }) => (
      <figure className="my-14">

        <img
          src={urlFor(value).width(1400).url()}
          alt={value.alt || 'Blog image'}
          className="rounded-3xl w-full shadow-lg border border-gray-200"
        />

        {value.caption && (
          <figcaption className="text-sm text-gray-500 mt-4 text-center italic">
            {value.caption}
          </figcaption>
        )}

      </figure>
    )
  },

  block: {
    h1: ({ children }) => (
      <h1 className="text-5xl font-semibold tracking-tight text-gray-900 mt-16 mb-8 leading-tight">
        {children}
      </h1>
    ),

    h2: ({ children }) => (
      <h2 className="text-4xl font-semibold tracking-tight text-gray-900 mt-16 mb-6 leading-tight">
        {children}
      </h2>
    ),

    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold text-gray-900 mt-12 mb-5">
        {children}
      </h3>
    ),

    normal: ({ children }) => (
      <p className="text-[18px] leading-9 text-gray-700 mb-7">
        {children}
      </p>
    ),

    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500 pl-6 italic text-gray-700 my-10 text-xl leading-9">
        {children}
      </blockquote>
    )
  },

  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-8 my-8 space-y-4 text-gray-700 text-[18px] leading-8">
        {children}
      </ul>
    ),

    number: ({ children }) => (
      <ol className="list-decimal pl-8 my-8 space-y-4 text-gray-700 text-[18px] leading-8">
        {children}
      </ol>
    )
  }
}

export default function PortableTextRenderer({
  value
}) {
  return (
    <PortableText
      value={value}
      components={components}
    />
  )
}