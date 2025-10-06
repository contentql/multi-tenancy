'use client'

import { env } from '@env'
import { useTenantSelection } from '@payloadcms/plugin-multi-tenant/client'
import {
  Button,
  useDocumentInfo,
  useField,
  useFormFields,
} from '@payloadcms/ui'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { updateVerificationStatus } from '@/actions/updateVerificationStatus'

import { checkDNSConfigAction } from './checkDNSConfigAction'

const VerifiedDomainField: React.FC<any> = props => {
  const { path } = props
  const tenant = useTenantSelection()
  const tenantSlug = tenant.options.find(
    opt => opt.value === tenant.selectedTenantID,
  )?.label

  const MAIN_DOMAIN =
    env.NEXT_PUBLIC_WEBSITE_URL?.replace(/^https?:\/\//, '') || ''
  const TENANT_DOMAIN = `${tenantSlug}.${MAIN_DOMAIN}`

  const { value, setValue } = useField<boolean>({ path })
  const { id } = useDocumentInfo()

  const { hostname } = useFormFields(([fields]) => ({
    hostname: fields?.hostname?.value as string | undefined,
  }))

  const [loading, setLoading] = useState(false)
  const [dnsDetails, setDnsDetails] = useState<any>(null)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  // Use ref to track if component is mounted
  const isMountedRef = useRef(true)

  const checkDNS = useCallback(async () => {
    if (!hostname) {
      setDnsDetails({
        success: false,
        verified: false,
        message: 'No hostname provided',
      })
      return
    }

    setLoading(true)
    try {
      const res = await checkDNSConfigAction(hostname, 'CNAME', TENANT_DOMAIN)

      if (isMountedRef.current) {
        if (res.success !== undefined) {
          setValue(res.verified)

          // Update the record in the database if verification status changed
          if (res.verified !== value && id) {
            await updateVerificationStatus(id as string, res.verified)
          }
        }
        setDnsDetails(res)
        setLastChecked(new Date())
      }
    } catch (error) {
      console.error('DNS check failed:', error)
      if (isMountedRef.current) {
        setDnsDetails({
          success: false,
          verified: false,
          message: 'Failed to check DNS',
          error: String(error),
        })
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }, [hostname, setValue, TENANT_DOMAIN, value, id])

  useEffect(() => {
    isMountedRef.current = true

    // Initial check
    checkDNS()

    // Auto-refresh every 30 seconds (reduced from 10 to avoid excessive calls)
    const interval = setInterval(checkDNS, 30000)

    return () => {
      isMountedRef.current = false
      clearInterval(interval)
    }
  }, [checkDNS])

  const getStatusIcon = () => {
    if (loading) return '⏳'
    if (value) return '✅'
    return '❌'
  }

  const getStatusText = () => {
    if (loading) return 'Checking...'
    if (value) return 'Verified'
    return 'Not verified'
  }

  return (
    <div
      style={{
        padding: '1rem',
        border: '1px solid var(--theme-elevation-100)',
        borderRadius: '4px',
        backgroundColor: 'var(--theme-elevation-0)',
      }}>
      <div style={{ marginBottom: '1rem' }}>
        <strong style={{ fontSize: '1rem' }}>Domain Verification</strong>
      </div>

      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <strong>Hostname:</strong> {hostname || <em>Not set</em>}
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <strong>Status:</strong>{' '}
          <span style={{ fontSize: '1rem' }}>
            {getStatusIcon()} {getStatusText()}
          </span>
        </div>

        {lastChecked && (
          <div
            style={{
              fontSize: '0.85rem',
              color: 'var(--theme-text-secondary)',
            }}>
            Last checked: {lastChecked.toLocaleTimeString()}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <Button onClick={checkDNS} size='small' disabled={loading || !hostname}>
          {loading ? 'Checking...' : 'Refresh DNS'}
        </Button>
      </div>

      {dnsDetails && (
        <div style={{ marginTop: '1rem' }}>
          <div
            style={{
              padding: '0.75rem',
              backgroundColor: 'var(--theme-elevation-50)',
              borderRadius: '4px',
              marginBottom: '0.5rem',
            }}>
            <strong>DNS Details:</strong>
            {dnsDetails.message && (
              <div
                style={{
                  marginTop: '0.5rem',
                  padding: '0.5rem',
                  backgroundColor: dnsDetails.verified
                    ? 'rgba(0, 200, 0, 0.1)'
                    : 'rgba(255, 165, 0, 0.1)',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                }}>
                {dnsDetails.message}
              </div>
            )}
          </div>

          <details style={{ fontSize: '0.85rem' }}>
            <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
              View raw DNS response
            </summary>
            <pre
              style={{
                background: 'var(--theme-elevation-50)',
                padding: '0.75rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                overflowX: 'auto',
                margin: 0,
              }}>
              {JSON.stringify(dnsDetails, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {!value && hostname && (
        <div
          style={{
            marginTop: '1rem',
            padding: '0.75rem',
            backgroundColor: 'rgba(255, 165, 0, 0.1)',
            borderLeft: '3px solid orange',
            borderRadius: '4px',
            fontSize: '0.9rem',
          }}>
          <strong>Instructions:</strong>
          <br />
          Add a CNAME record in your DNS settings:
          <br />
          <code
            style={{
              display: 'block',
              marginTop: '0.5rem',
              padding: '0.5rem',
              backgroundColor: 'var(--theme-elevation-50)',
              borderRadius: '4px',
            }}>
            {hostname} → {TENANT_DOMAIN}
          </code>
        </div>
      )}
    </div>
  )
}

export default VerifiedDomainField
