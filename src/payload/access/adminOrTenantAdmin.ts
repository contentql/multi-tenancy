import { getTenantFromCookie } from '@payloadcms/plugin-multi-tenant/utilities'
import { Access, FieldAccess } from 'payload'

import { getCollectionIDType } from '@/lib/getCollectionIDType'
import { getUserTenantIDs } from '@/lib/getUserTenantIDs'

import { isAdmin } from './isAdmin'

/**
 * Tenant admins and super admins can will be allowed access
 */
export const adminOrTenantAdminAccess: Access = ({ req }) => {
  if (!req.user) {
    return false
  }

  if (isAdmin(req.user)) {
    return true
  }

  const adminTenantAccessIDs = getUserTenantIDs(req.user, 'tenant-admin')

  const selectedTenant = getTenantFromCookie(
    req.headers,
    getCollectionIDType({ payload: req.payload, collectionSlug: 'tenants' }),
  )

  if (
    selectedTenant &&
    adminTenantAccessIDs.includes(selectedTenant as string)
  ) {
    return true
  }

  return false
}

export const adminOrTenantAdmin = async ({ req }: { req: any }) => {
  if (!req.user) {
    return false
  }

  if (isAdmin(req.user)) {
    return true
  }

  const adminTenantAccessIDs = getUserTenantIDs(req.user, 'tenant-admin')

  const selectedTenant = getTenantFromCookie(
    req.headers,
    getCollectionIDType({ payload: req.payload, collectionSlug: 'tenants' }),
  )

  if (
    selectedTenant &&
    adminTenantAccessIDs.includes(selectedTenant as string)
  ) {
    return true
  }

  if (!selectedTenant) {
    const domain = req.headers.get('host')
    const subdomain = domain?.split('.').at(0)
    const relatedOrg = await req.payload.find({
      collection: 'tenants',
      depth: 0,
      limit: 1,
      where: {
        subdomain: {
          equals: subdomain,
        },
      },
    })

    if (
      relatedOrg &&
      relatedOrg.docs.length > 0 &&
      adminTenantAccessIDs.includes(relatedOrg.docs[0].id)
    ) {
      return true
    }
  }
  return false
}

export const adminOrTenantAdminFieldAccess: FieldAccess = ({ req }) => {
  if (isAdmin(req.user)) {
    return true
  }
  const adminTenantAccessIDs = getUserTenantIDs(req.user, 'tenant-admin')

  const selectedTenant = getTenantFromCookie(
    req.headers,
    getCollectionIDType({ payload: req.payload, collectionSlug: 'tenants' }),
  )

  if (
    selectedTenant &&
    adminTenantAccessIDs.includes(selectedTenant as string)
  ) {
    return true
  }

  return false
}
