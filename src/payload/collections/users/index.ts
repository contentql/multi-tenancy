import { adminOrCurrentUserFieldAccess } from '../../access/adminOrCurrentUserFieldAccess'
import { isAdminFieldAccess } from '../../access/isAdminFieldAccess'
import { slugField } from '../../fields/slug/index'
import { AUTH_GROUP } from '../constants'
import { socialLinksField } from '../site-settings'
import { env } from '@env'
import { tenantsArrayField } from '@payloadcms/plugin-multi-tenant/fields'
import { CollectionConfig } from 'payload'

import { ResetPassword } from '@/emails/reset-password'
import { UserAccountVerification } from '@/emails/verify-email'
import { adminOrTenantAdminFieldAccess } from '@/payload/access/adminOrTenantAdmin'
import { isAdmin } from '@/payload/access/isAdmin'

import { createAccess } from './access/create'
import { readAccess } from './access/read'
import { updateAndDeleteAccess } from './access/updateAndDelete'
import { authorAccessAfterUpdate } from './hooks/authorAccessAfterUpdate'
import { handleUserRoles } from './hooks/handleUserRoles'
import { preventAdminRoleUpdate } from './hooks/preventAdminRoleUpdate'
import { revalidateAuthors } from './hooks/revalidateAuthors'
import { setCookieBasedOnDomain } from './hooks/setCookieBasedOnDomain'

const defaultTenantArrayField = tenantsArrayField({
  tenantsArrayFieldName: 'tenants',
  tenantsArrayTenantFieldName: 'tenant',
  tenantsCollectionSlug: 'tenants',
  arrayFieldAccess: {
    update: isAdminFieldAccess,
    create: isAdminFieldAccess,
  },
  tenantFieldAccess: {
    update: isAdminFieldAccess,
    create: isAdminFieldAccess,
  },
  rowFields: [
    {
      name: 'roles',
      type: 'select',
      defaultValue: ['tenant-viewer'],
      hasMany: true,
      options: ['tenant-admin', 'tenant-viewer'],
      required: true,
      access: {
        update: adminOrTenantAdminFieldAccess,
        create: adminOrTenantAdminFieldAccess,
      },
    },
  ],
})

// export function getCookieDomain() {
//   const rawUrl = env.PAYLOAD_URL.startsWith('http')
//     ? env.PAYLOAD_URL
//     : `https://${env.PAYLOAD_URL}`

//   const { hostname } = new URL(rawUrl)

//   // If it's localhost or *.localhost (dev)
//   if (hostname === 'localhost' || hostname.endsWith('.localhost')) {
//     return '.localhost'
//   }

//   // For production → always use the root domain
//   // Example: PAYLOAD_URL = "https://charan.net" → ".charan.net"
//   // Example: PAYLOAD_URL = "https://blog.charan.net" → ".charan.net"
//   const parts = hostname.split('.')
//   if (parts.length > 2) {
//     // remove subdomain(s)
//     return '.' + parts.slice(-2).join('.')
//   }

//   return '.' + hostname
// }

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    group: AUTH_GROUP,
    useAsTitle: 'email',
  },
  auth: {
    cookies: {
      secure: true,
    },
    verify: {
      generateEmailHTML: ({ token, user }) => {
        return UserAccountVerification({
          actionLabel: 'verify your account',
          buttonText: 'Verify Account',
          userName: user.username,
          image: user.avatar,
          href: `${env.PAYLOAD_URL}/verify-email?token=${token}&id=${user.id}`,
        })
      },
    },
    forgotPassword: {
      generateEmailHTML: args => {
        return ResetPassword({
          resetPasswordLink: `${env.PAYLOAD_URL}/reset-password?token=${args?.token}`,
          userFirstName: args?.user.username,
        })
      },
    },
  },

  hooks: {
    afterChange: [revalidateAuthors],
    beforeChange: [
      authorAccessAfterUpdate,
      handleUserRoles,
      preventAdminRoleUpdate,
    ],
    afterLogin: [setCookieBasedOnDomain],
  },
  access: {
    // admin: async ({ req }) => adminOrTenantAdmin({ req }),
    create: createAccess,
    delete: updateAndDeleteAccess,
    read: readAccess,
    update: updateAndDeleteAccess,
  },

  fields: [
    {
      name: 'displayName',
      label: 'Display Name',
      type: 'text',
      saveToJWT: true,
      access: {
        update: adminOrCurrentUserFieldAccess,
      },
    },
    slugField({
      fieldToUse: 'username',
      overrides: {
        name: 'username',
        label: 'Username',
        type: 'text',
        saveToJWT: true,
        required: true,
        unique: true,
        admin: {
          readOnly: false,
          position: undefined,
          disableBulkEdit: false,
        },
      },
    }),
    {
      name: 'imageUrl',
      type: 'upload',
      relationTo: 'media',
      access: {
        update: adminOrCurrentUserFieldAccess,
      },
    },
    // only admin can update the role field
    {
      admin: {
        position: 'sidebar',
      },
      name: 'role',
      type: 'select',
      defaultValue: ['user'],
      hasMany: true,
      required: true,
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Author',
          value: 'author',
        },
        {
          label: 'User',
          value: 'user',
        },
      ],

      access: {
        update: ({ req }) => {
          return isAdmin(req.user)
        },
      },
    },
    {
      name: 'emailVerified',
      type: 'date',
      access: {
        create: isAdminFieldAccess,
        update: isAdminFieldAccess,
      },
    },
    {
      type: 'array',
      name: 'socialLinks',
      label: 'Social Links',
      fields: [socialLinksField],
      access: {
        update: adminOrCurrentUserFieldAccess,
      },
    },
    {
      ...defaultTenantArrayField,
      admin: {
        ...(defaultTenantArrayField?.admin || {}),
        position: 'sidebar',
      },
    },
  ],
}
