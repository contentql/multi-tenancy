'use server'

import dns from 'dns/promises'

export async function checkDNSConfigAction(
  domain: string,
  type: string,
  target: string,
) {
  try {
    // Try to resolve CNAME first if proxyDomain is provided
    if (target) {
      dns.setServers([
        // IPv4
        '1.1.1.1', // Cloudflare
        '8.8.8.8', // Google
        '9.9.9.9', // Quad9

        // IPv6
        '2606:4700:4700::1111', // Cloudflare
        '2001:4860:4860::8888', // Google
        '2620:fe::fe', // Quad9
      ])
      const cnames = await dns.resolveCname(domain).catch(() => [])

      console.log({ domain, target, cnames })

      if (cnames.length > 0) {
        // Compare the CNAME target to the expected proxy domain (strict match)
        const verified = cnames.some(
          cname => cname.toLowerCase() === target.toLowerCase(),
        )

        return {
          success: true,
          verified,
          details: cnames,
        }
      }
    }

    // Fallback: check A record
    const addresses = await dns.resolve4(domain)

    return {
      Success: true,
      verified: addresses.includes(target),
      details: addresses,
    }
  } catch (e) {
    return { success: false, verified: false, details: e }
  }
}
