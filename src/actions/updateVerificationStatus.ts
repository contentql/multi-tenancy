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

    if (!siteSetting) {
      return { success: false, message: 'SiteSettings record not found.' }
    }

    if (!siteSetting.domain) {
      return { success: false, message: 'Domain configuration not found.' }
    }

    // Update only the verified field inside the single domain object
    const updatedDomain = {
      ...siteSetting.domain,
      verified,
    }

    await payload.update({
      collection: 'SiteSettings',
      id: siteSetting.id,
      data: {
        domain: updatedDomain,
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
