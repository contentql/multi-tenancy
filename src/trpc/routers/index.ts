import { router } from '@/trpc'
import { authorRouter } from '@/trpc/routers/author'
import { blogRouter } from '@/trpc/routers/blog'
import { pageRouter } from '@/trpc/routers/page'
import { siteSettingsRouter } from '@/trpc/routers/site-settings'
import { tagRouter } from '@/trpc/routers/tag'

import { formRouter } from './form'
import { searchRouter } from './search'
import { tenantRouter } from './tenant'

export const appRouter = router({
  page: pageRouter,
  blog: blogRouter,
  siteSettings: siteSettingsRouter,
  tag: tagRouter,
  author: authorRouter,
  search: searchRouter,
  form: formRouter,
  tenant: tenantRouter,
})

export type AppRouter = typeof appRouter
