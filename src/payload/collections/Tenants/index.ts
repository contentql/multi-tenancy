import { AUTH_GROUP } from '../constants'
import { CollectionConfig } from 'payload'

import { updateAndDeleteAccess } from './access/updateAndDelete'
import { afterTenantDeleteRemoveFromCookie } from './hooks/afterTenantDeleteRemoveFromCookie'
import { assignToTenantAdmin } from './hooks/assignToTenantAdmin'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'name',
    group: AUTH_GROUP,
  },
  access: {
    create: updateAndDeleteAccess,
    delete: updateAndDeleteAccess,
    read: ({ req }) => Boolean(req.user),
    update: updateAndDeleteAccess,
  },

  hooks: {
    afterChange: [assignToTenantAdmin],
    afterDelete: [afterTenantDeleteRemoveFromCookie],
  },

  fields: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      index: true,
      required: true,
      unique: true,
    },
    {
      name: 'subdomain',
      label: 'Subdomain',
      type: 'text',
      index: true,
      required: true,
      unique: true,
    },
  ],
}
