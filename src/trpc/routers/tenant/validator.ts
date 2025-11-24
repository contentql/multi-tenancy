import { z } from 'zod'

export const getTenantByIDSchema = z.object({
  tenantID: z.string().min(3),
})
