'use client'

import { env } from '@env'
import { useTenantSelection } from '@payloadcms/plugin-multi-tenant/client'
import { useFormFields } from '@payloadcms/ui'
import React, { useMemo } from 'react'

const CustomDomainInstructions: React.FC = () => {
  const tenant = useTenantSelection()
  const tenantSlug = tenant.options.find(
    opt => opt.value === tenant.selectedTenantID,
  )?.label

  const MAIN_DOMAIN =
    env.NEXT_PUBLIC_WEBSITE_URL?.replace(/^https?:\/\//, '') || ''
  const TENANT_DOMAIN = `${tenantSlug}.${MAIN_DOMAIN}`

  const { hostname, verified } = useFormFields(([fields]) => ({
    hostname: fields?.hostname?.value as string | undefined,
    verified: fields?.verified?.value as boolean | undefined,
  }))

  const { isSubdomain, subdomain, rootDomain } = useMemo(() => {
    if (!hostname) {
      return {
        isSubdomain: false,
        subdomain: null,
        rootDomain: null,
      }
    }

    const parts = hostname.split('.')

    // If hostname has more than 2 parts, it's likely a subdomain
    // e.g., "user1.work.com" = ["user1", "work", "com"]
    const isSubdomain = parts.length > 2

    return {
      isSubdomain,
      subdomain: isSubdomain ? parts[0] : null,
      rootDomain: isSubdomain ? parts.slice(1).join('.') : hostname,
    }
  }, [hostname])

  if (verified) {
    return (
      <div className='rounded border border-green-300 bg-green-50 p-4 text-sm'>
        <div className='flex items-center gap-2'>
          <span className='text-lg'>✅</span>
          <div>
            <p className='font-semibold text-green-800'>Domain Verified!</p>
            <p className='text-green-700'>
              Your custom domain{' '}
              <code className='rounded bg-green-100 px-1'>{hostname}</code> is
              properly configured and active.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!hostname) {
    return (
      <div className='rounded border border-gray-300 bg-gray-50 p-4 text-sm'>
        <p className='font-medium text-gray-700'>
          Please enter a hostname above to see DNS configuration instructions.
        </p>
      </div>
    )
  }

  return (
    <div className='rounded border border-blue-300 bg-blue-50 p-4 text-sm leading-relaxed'>
      <h3 className='mb-3 text-base font-semibold text-blue-900'>
        DNS Configuration Instructions
      </h3>

      <div className='mb-4 rounded border border-blue-200 bg-white p-3'>
        <p className='mb-2 text-xs font-medium uppercase tracking-wide text-blue-800'>
          Your Domain
        </p>
        <code className='text-base font-semibold text-blue-900'>
          {hostname}
        </code>
      </div>

      {isSubdomain ? (
        <div className='space-y-3'>
          <div>
            <p className='mb-2 font-medium text-gray-800'>
              Subdomain Configuration:
            </p>
            <ol className='ml-4 list-outside list-decimal space-y-1 text-gray-700'>
              <li>
                Go to your DNS provider for <strong>{rootDomain}</strong>
              </li>
              <li>Add a new CNAME record with these details:</li>
            </ol>
          </div>

          <div className='rounded border border-gray-300 bg-white p-3'>
            <table className='w-full text-xs'>
              <tbody>
                <tr className='border-b'>
                  <td className='py-1.5 pr-4 font-semibold'>Type:</td>
                  <td className='py-1.5'>
                    <code className='rounded bg-gray-100 px-2 py-0.5'>
                      CNAME
                    </code>
                  </td>
                </tr>
                <tr className='border-b'>
                  <td className='py-1.5 pr-4 font-semibold'>Name:</td>
                  <td className='py-1.5'>
                    <code className='rounded bg-gray-100 px-2 py-0.5'>
                      {subdomain}
                    </code>
                  </td>
                </tr>
                <tr className='border-b'>
                  <td className='py-1.5 pr-4 font-semibold'>Target/Content:</td>
                  <td className='py-1.5'>
                    <code className='rounded bg-gray-100 px-2 py-0.5'>
                      {TENANT_DOMAIN}
                    </code>
                  </td>
                </tr>
                <tr>
                  <td className='py-1.5 pr-4 font-semibold'>Proxy Status:</td>
                  <td className='py-1.5'>
                    <code className='rounded bg-gray-100 px-2 py-0.5'>
                      DNS only (off)
                    </code>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className='rounded bg-blue-100 p-2 text-xs text-blue-800'>
            <strong>Note:</strong> If using Cloudflare, make sure the proxy
            (orange cloud) is disabled.
          </div>
        </div>
      ) : (
        <div className='space-y-3'>
          <div>
            <p className='mb-2 font-medium text-gray-800'>
              Root Domain Configuration:
            </p>
            <ol className='ml-4 list-outside list-decimal space-y-1 text-gray-700'>
              <li>
                Go to your DNS provider for <strong>{rootDomain}</strong>
              </li>
              <li>Add a new CNAME record with these details:</li>
            </ol>
          </div>

          <div className='rounded border border-gray-300 bg-white p-3'>
            <table className='w-full text-xs'>
              <tbody>
                <tr className='border-b'>
                  <td className='py-1.5 pr-4 font-semibold'>Type:</td>
                  <td className='py-1.5'>
                    <code className='rounded bg-gray-100 px-2 py-0.5'>
                      CNAME
                    </code>
                  </td>
                </tr>
                <tr className='border-b'>
                  <td className='py-1.5 pr-4 font-semibold'>Name:</td>
                  <td className='py-1.5'>
                    <code className='rounded bg-gray-100 px-2 py-0.5'>@</code>
                    <span className='ml-2 text-gray-600'>(or leave blank)</span>
                  </td>
                </tr>
                <tr className='border-b'>
                  <td className='py-1.5 pr-4 font-semibold'>Target/Content:</td>
                  <td className='py-1.5'>
                    <code className='rounded bg-gray-100 px-2 py-0.5'>
                      {TENANT_DOMAIN}
                    </code>
                  </td>
                </tr>
                <tr>
                  <td className='py-1.5 pr-4 font-semibold'>Proxy Status:</td>
                  <td className='py-1.5'>
                    <code className='rounded bg-gray-100 px-2 py-0.5'>
                      DNS only (off)
                    </code>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className='rounded border border-amber-300 bg-amber-50 p-2 text-xs text-amber-900'>
            <strong>⚠️ Important:</strong> Some DNS providers don&apos;t support
            CNAME records for root domains (@). If you encounter this issue, you
            may need to use an A record or contact your DNS provider about CNAME
            flattening or ALIAS records.
          </div>
        </div>
      )}

      <div className='mt-4 space-y-2 border-t border-blue-200 pt-3'>
        <p className='text-xs font-semibold text-gray-700'>
          After adding the DNS record:
        </p>
        <ul className='ml-4 list-outside list-disc space-y-1 text-xs text-gray-600'>
          <li>
            DNS changes can take 5-10 minutes to propagate (sometimes up to 48
            hours)
          </li>
          <li>
            The verification status above will automatically update when DNS is
            configured correctly
          </li>
          <li>
            You can click &ldquo;Refresh DNS&rdquo; to manually check the status
          </li>
        </ul>
      </div>
    </div>
  )
}

export default CustomDomainInstructions
