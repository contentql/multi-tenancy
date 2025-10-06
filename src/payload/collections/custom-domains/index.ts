import { AUTH_GROUP } from '../constants'
import { CollectionConfig } from 'payload'

import { adminOrTenantAdminAccess } from '@/payload/access/adminOrTenantAdmin'

export const CustomDomains: CollectionConfig = {
  slug: 'customDomains',
  labels: {
    singular: 'CustomDomain',
    plural: 'CustomDomains',
  },
  access: {
    read: () => true,
    create: adminOrTenantAdminAccess,
    update: adminOrTenantAdminAccess,
    delete: adminOrTenantAdminAccess,
  },
  admin: {
    useAsTitle: 'hostname',
    group: AUTH_GROUP,
  },
  fields: [
    {
      name: 'verified',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        readOnly: true,
        description: 'Indicates whether the custom domain has been verified',
        components: {
          Field:
            '@/payload/collections/custom-domains/components/VerifiedDomainField',
        },
      },
    },
    {
      name: 'hostname',
      type: 'text',
      admin: {
        description: 'The custom domain hostname (e.g., example.com)',
      },
      required: true,
      unique: true,
    },
    {
      name: 'instructions',
      type: 'ui',
      admin: {
        components: {
          Field:
            '@/payload/collections/custom-domains/components/CustomDomainInstructions',
        },
      },
    },
  ],
  hooks: {},
}
