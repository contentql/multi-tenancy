import { adminProcedure, router } from '@/trpc'

import { getTenantByIDSchema } from './validator'

export const tenantRouter = router({
  getTenantByID: adminProcedure
    .input(getTenantByIDSchema)
    .query(async ({ ctx, input }) => {
      const { payload } = ctx
      const { tenantID } = input

      const tenantDetails = await payload.findByID({
        id: tenantID,
        collection: 'tenants',
      })

      return tenantDetails
    }),
})
