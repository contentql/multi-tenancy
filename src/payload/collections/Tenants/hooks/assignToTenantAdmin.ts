import { Tenant, User } from '@payload-types'
import { CollectionAfterChangeHook } from 'payload'

export const assignToTenantAdmin: CollectionAfterChangeHook<Tenant> = async ({
  doc,
  req,
  operation,
  context,
}) => {
  if (operation === 'create') {
    if (context?.skipAssignToTenantAdmin) return
    if (req.user?.role?.includes('admin')) return
    const { user, payload } = req

    let AssignedUser: User | null = null

    if (typeof user === 'string') {
      const userDoc = await payload.findByID({
        collection: 'users',
        id: user,
      })
      AssignedUser = userDoc
    } else if (typeof user === 'object' && user !== null) {
      AssignedUser = user
    }
    await payload.update({
      collection: 'users',
      id: AssignedUser?.id!,
      data: {
        tenants: [
          ...(user?.tenants ?? []),
          {
            tenant: doc.id,
            roles: ['tenant-admin'],
          },
        ],
      },
    })
    // const redirectHeader = new Headers({
    //   'X-Payload-Redirect': '/admin/collections/tenants',
    // })

    // req.responseHeaders = req.responseHeaders
    //   ? mergeHeaders(req.responseHeaders, redirectHeader)
    //   : redirectHeader
  }
}
