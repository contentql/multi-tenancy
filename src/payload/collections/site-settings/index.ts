import { themeSettingsTab } from '../../fields/theme'
import type { CollectionConfig, Field } from 'payload'
import { z } from 'zod'

import { adminOrTenantAdminAccess } from '@/payload/access/adminOrTenantAdmin'
import { SETTINGS_GROUP } from '@/payload/collections/constants'

import { revalidateSiteSettings } from './hooks/revalidateSiteSettings'

const validateURL = z
  .string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  })
  .url()

const menuItem: Field[] = [
  {
    type: 'row',
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'type',
            type: 'radio',
            admin: {
              layout: 'horizontal',
              width: '50%',
            },
            defaultValue: 'reference',
            options: [
              {
                label: 'Internal link',
                value: 'reference',
              },
              {
                label: 'Custom URL',
                value: 'custom',
              },
            ],
          },
          {
            name: 'newTab',
            type: 'checkbox',
            admin: {
              style: {
                alignSelf: 'flex-end',
              },
              width: '50%',
            },
            label: 'Open in new tab',
          },
        ],
      },
    ],
  },
  {
    name: 'icon',
    type: 'upload',
    label: 'Icon',
    relationTo: 'media',
    admin: {
      description: 'Upload an svg or logo to be displayed with link',
    },
  },
  {
    type: 'row',
    fields: [
      {
        name: 'label',
        type: 'text',
        label: 'Label',
        required: true,
      },
      {
        type: 'relationship',
        name: 'page',
        relationTo: ['pages'],
        admin: {
          condition: (_data, siblingData) => {
            return siblingData.type === 'reference'
          },
        },
        required: true,
        maxDepth: 1,
      },
      {
        name: 'url',
        type: 'text',
        label: 'URL',
        admin: {
          condition: (_data, siblingData) => siblingData.type === 'custom',
        },
        required: true,
      },
    ],
  },
]

const menuGroupItem = (isNavbar = false): Field => ({
  type: 'group',
  name: 'menuLinkGroup',
  label: 'Link Group',
  fields: [
    {
      type: 'text',
      name: 'groupTitle',
      label: 'Group Title',
      required: true,
    },
    {
      type: 'array',
      name: 'groupLinks',
      label: 'Links',
      fields: menuItem,
      dbName: isNavbar ? 'navbarLinks' : 'footerLinks',
    },
  ],
  admin: {
    condition: (_data, siblingData) => siblingData.group,
  },
})

const menuField = (isNavbar = false): Field[] => {
  return [
    {
      type: 'checkbox',
      name: 'group',
      label: 'Group',
      defaultValue: false,
      admin: {
        description: 'Check to create group of links',
      },
    },
    {
      name: 'menuLink',
      type: 'group',
      label: 'Link',
      fields: menuItem,
      admin: {
        condition: (_data, siblingData) => !siblingData.group,
      },
    },
    menuGroupItem(isNavbar),
  ]
}

const logoField: Field[] = [
  {
    name: 'imageUrl',
    type: 'upload',
    required: true,
    relationTo: 'media',
    label: 'Image',
  },
  {
    type: 'row',
    fields: [
      {
        label: 'Height',
        name: 'height',
        type: 'number',
        admin: {
          description: 'Adjust to the height of the logo',
        },
      },
      {
        label: 'Width',
        name: 'width',
        type: 'number',
        admin: {
          description: 'Adjust to the width of the logo',
        },
      },
    ],
  },
]

export const socialLinksField: Field = {
  type: 'row',
  fields: [
    {
      type: 'select',
      name: 'platform',
      label: 'Platform',
      required: true,
      options: [
        {
          label: 'Website',
          value: 'website',
        },
        {
          label: 'Facebook',
          value: 'facebook',
        },
        {
          label: 'Instagram',
          value: 'instagram',
        },
        {
          label: 'Twitter',
          value: 'twitter',
        },
        {
          label: 'LinkedIn',
          value: 'linkedin',
        },
        {
          label: 'YouTube',
          value: 'youtube',
        },
        {
          label: 'TikTok',
          value: 'tiktok',
        },
        {
          label: 'Pinterest',
          value: 'pinterest',
        },
        {
          label: 'Snapchat',
          value: 'snapchat',
        },
        {
          label: 'Reddit',
          value: 'reddit',
        },
        {
          label: 'Tumblr',
          value: 'tumblr',
        },
        {
          label: 'WhatsApp',
          value: 'whatsapp',
        },
        {
          label: 'Telegram',
          value: 'telegram',
        },
        {
          label: 'GitHub',
          value: 'github',
        },
        {
          label: 'Medium',
          value: 'medium',
        },
        {
          label: 'Quora',
          value: 'quora',
        },
        {
          label: 'Discord',
          value: 'discord',
        },
      ],
    },
    {
      type: 'text',
      name: 'value',
      label: 'Link',
      required: true,
      validate: (value: any, args: any) => {
        const { success } = validateURL.safeParse(value)

        return success || 'Link is not valid'
      },
    },
  ],
}

export const SiteSettings: CollectionConfig = {
  slug: 'SiteSettings',
  access: {
    read: () => true,
    update: adminOrTenantAdminAccess,
    create: adminOrTenantAdminAccess,
    delete: adminOrTenantAdminAccess,
  },
  admin: {
    group: SETTINGS_GROUP,
  },
  hooks: { afterChange: [revalidateSiteSettings] },
  fields: [
    {
      type: 'tabs',
      label: 'Settings',
      tabs: [
        {
          label: 'General',
          name: 'general',
          fields: [
            { type: 'text', name: 'title', required: true },
            {
              type: 'textarea',
              name: 'description',
              required: true,
            },
            {
              name: 'faviconUrl',
              type: 'upload',
              required: true,
              relationTo: 'media',
              label: 'Favicon',
              admin: {
                description: 'We recommend a maximum size of 256 * 256 pixels',
              },
            },
            {
              name: 'ogImageUrl',
              type: 'upload',
              required: true,
              relationTo: 'media',
              label: 'OG Image',
              admin: {
                description: 'We recommend a maximum size of 1200 * 630 pixels',
              },
            },
            {
              name: 'keywords',
              type: 'text',
              hasMany: true,
            },
          ],
        },
        {
          label: 'Navbar',
          name: 'navbar',
          fields: [
            {
              name: 'logo',
              type: 'group',
              interfaceName: 'BrandLogo', // optional
              label: 'Logo',
              fields: logoField,
            },
            {
              name: 'menuLinks',
              label: 'Menu Links',
              type: 'array',
              fields: menuField(true),
              dbName: 'navbarMenu',
            },
          ],
        },
        {
          label: 'Footer',
          name: 'footer',
          fields: [
            {
              name: 'logo',
              type: 'group',
              interfaceName: 'BrandLogo', // optional
              label: 'Logo',
              fields: [
                ...logoField,
                {
                  type: 'text',
                  label: 'Description',
                  name: 'description',
                  admin: {
                    description: 'This text appears below the footer image',
                  },
                },
              ],
            },
            {
              name: 'footerLinks',
              type: 'array',
              label: 'Footer Links',
              fields: menuField(),
              dbName: 'FooterMenu',
            },
            {
              type: 'array',
              name: 'socialLinks',
              label: 'Social Links',
              fields: [socialLinksField],
            },
            { type: 'text', name: 'copyright', label: 'Copyright' },
          ],
        },
        {
          label: 'Custom Domain Configuration',
          fields: [
            {
              type: 'array',
              name: 'domains',
              fields: [
                {
                  name: 'verified',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    readOnly: true,
                    description:
                      'Indicates whether the custom domain has been verified',
                    components: {
                      Field:
                        '@/payload/collections/site-settings/components/VerifiedDomainField',
                    },
                  },
                },
                {
                  name: 'hostname',
                  type: 'text',
                  admin: {
                    description:
                      'The custom domain hostname (e.g., example.com)',
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
                        '@/payload/collections/site-settings/components/CustomDomainInstructions',
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Redirection Links',
          name: 'redirectionLinks',
          fields: [
            {
              name: 'blogLink',
              type: 'relationship',
              relationTo: ['pages'],
              label: 'Blog redirect link',
              maxDepth: 1,
              admin: {
                description: 'This redirects to a blog details page',
              },
            },
            {
              name: 'productLink',
              type: 'relationship',
              relationTo: ['pages'],
              label: 'Product redirect link',
              maxDepth: 1,
              admin: {
                description: 'This redirect to a product details page',
              },
            },
            {
              name: 'authorLink',
              type: 'relationship',
              relationTo: ['pages'],
              label: 'Author redirect link',
              maxDepth: 1,
              admin: {
                description: 'This redirects to a author details page',
              },
            },
            {
              name: 'tagLink',
              type: 'relationship',
              relationTo: ['pages'],
              label: 'Tag redirect link',
              maxDepth: 1,
              admin: {
                description: 'This redirects to a tag details page',
              },
            },
          ],
        },
        {
          label: 'Monetization',
          name: 'monetization',
          fields: [
            {
              name: 'adSenseId',
              type: 'text',
              label: 'Google AdSense',
              admin: {
                description: 'Add the publisher-id from Google AdSense Console',
              },
            },
            {
              name: 'measurementId',
              type: 'text',
              label: 'Google Analytics Measurement ID',
              admin: {
                description:
                  'Add the measurement id from Google Analytics dashboard',
              },
            },
          ],
        },
        themeSettingsTab,
      ],
    },
  ],
}
