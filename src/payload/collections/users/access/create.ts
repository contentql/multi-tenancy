import { User } from '@payload-types'
import type { Access } from 'payload'

import { isAdmin } from '@/payload/access/isAdmin'

export const createAccess: Access<User> = ({ req }) => {
  if (!req.user) {
    return false
  }

  if (isAdmin(req.user)) {
    return true
  }

  if (!isAdmin(req.user) && req.data?.role?.includes('admin')) {
    return false
  }

  // const adminTenantAccessIDs = getUserTenantIDs(req.user, 'tenant-admin')

  // const requestedTenants: Tenant['id'][] =
  //   req.data?.tenants?.map((t: { tenant: Tenant['id'] }) => t.tenant) ?? []

  // const hasAccessToAllRequestedTenants = requestedTenants.every(tenantID =>
  //   adminTenantAccessIDs.includes(tenantID),
  // )

  // if (hasAccessToAllRequestedTenants) {
  //   return true
  // }

  return false
}
