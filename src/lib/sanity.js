import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: 'r8druymq',
  dataset: 'production',
  apiVersion: '2024-01-15',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN
})