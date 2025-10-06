'use server'

import config from '@payload-config'
import { getPayload } from 'payload'

// app/actions/updateVerificationStatus.ts or wherever you keep your server actions

// app/actions/updateVerificationStatus.ts or wherever you keep your server actions

export async function updateVerificationStatus(id: string, verified: boolean) {
  try {
    if (!id) {
      return {
        success: false,
        message: 'ID is required',
      }
    }

    const payload = await getPayload({ config })

    // Update the custom domain record
    await payload.update({
      collection: 'customDomains',
      id,
      data: {
        verified,
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
