import { Tenant } from '@payload-types'
import { getTenantFromCookie } from '@payloadcms/plugin-multi-tenant/utilities'
import {
  CollectionAfterDeleteHook,
  generateCookie,
  mergeHeaders,
} from 'payload'

import { getCollectionIDType } from '@/lib/getCollectionIDType'

export const afterTenantDeleteRemoveFromCookie: CollectionAfterDeleteHook<
  Tenant
> = async ({ req, id }) => {
  const selectedTenant = getTenantFromCookie(
    req.headers,
    getCollectionIDType({ payload: req.payload, collectionSlug: 'tenants' }),
  )
  if (selectedTenant && selectedTenant === id) {
    const deleteTenantCookie = generateCookie({
      name: 'payload-tenant',
      value: '',
      returnCookieAsObject: false,
      path: '/',
      expires: new Date(0), // Expired in the past
    })

    const newHeaders = new Headers({
      'Set-Cookie': deleteTenantCookie as string,
    })
    req.responseHeaders = req.responseHeaders
      ? mergeHeaders(req.responseHeaders, newHeaders)
      : newHeaders
  }
}
