import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: 'qjgj24gz',
  dataset: 'production',
  apiVersion: '2025-01-01',
  useCdn: true
})