import { PortableText } from '@portabletext/react'

import { urlFor } from '../../sanity/image'

const components = {
  types: {
    image: ({ value }) => (
      <figure className="my-10">
        <img
          src={urlFor(value).width(1200).url()}
          alt={value.alt || 'Blog image'}
          className="rounded-2xl w-full"
        />

        {value.caption && (
          <figcaption className="text-sm text-gray-500 mt-3 text-center">
            {value.caption}
          </figcaption>
        )}
      </figure>
    )
  },

  block: {
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold mt-10 mb-6">
        {children}
      </h1>
    ),

    h2: ({ children }) => (
      <h2 className="text-3xl font-bold mt-10 mb-4">
        {children}
      </h2>
    ),

    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold mt-8 mb-3">
        {children}
      </h3>
    ),

    normal: ({ children }) => (
      <p className="leading-8 text-gray-700">
        {children}
      </p>
    )
  },

  list: {
    bullet: ({ children }) => (
      <ul className="list-disc ml-6 space-y-2">
        {children}
      </ul>
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