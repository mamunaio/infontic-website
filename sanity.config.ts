import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { schemaTypes } from '@/sanity/schemas'

export default defineConfig({
  name: 'default',
  title: 'Infontic',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'g9p5cunb',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  basePath: '/studio',

  plugins: [deskTool()],

  schema: {
    types: schemaTypes,
  },
})
