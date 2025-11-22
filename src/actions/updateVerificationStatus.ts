'use server'

import config from '@payload-config'
import { getPayload } from 'payload'

// app/actions/updateVerificationStatus.ts or wherever you keep your server actions

// app/actions/updateVerificationStatus.ts or wherever you keep your server actions

export async function updateVerificationStatus({
  siteSettingID,
  hostname,
  verified,
}: {
  siteSettingID: string
  hostname: string
  verified: boolean
}) {
  try {
    if (!siteSettingID) {
      return {
        success: false,
        message: 'ID is required',
      }
    }

    const payload = await getPayload({ config })

    const siteSetting = await payload.findByID({
      collection: 'SiteSettings',
      id: siteSettingID,
    })

    const domains = siteSetting.domains ?? []
    const updateDomains = domains.map(domain => {
      if (domain.hostname === hostname) {
        return {
          ...domain,
          verified,
        }
      }

      return domain
    })

    // Update the custom domain record
    await payload.update({
      collection: 'SiteSettings',
      id: siteSetting?.id,
      data: {
        domains: updateDomains,
      },
    })

    return {
      success: true,
      message: 'Verification status updated',
    }
  } catch (error) {
    console.error('Error updating verification status:', error)

    return {
      success: false,
      message: 'Failed to update verification status',
    }
  }
}
