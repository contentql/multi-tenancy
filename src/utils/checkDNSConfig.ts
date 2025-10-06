import dns from 'dns/promises'

const PUBLIC_DNS_SERVERS = [
  '1.1.1.1',
  '1.0.0.1', // Cloudflare
  '8.8.8.8',
  '8.8.4.4', // Google
  '9.9.9.9',
  '149.112.112.112', // Quad9
  '208.67.222.222',
  '208.67.220.220', // OpenDNS
  '64.6.64.6',
  '64.6.65.6', // Verisign
  '94.140.14.14',
  '94.140.15.15', // AdGuard
]

async function resolveRecord(domain: string, type: string) {
  const result = await dns.resolveCname(domain)
  console.log({ result })
  switch (type.toUpperCase()) {
    case 'A':
      return dns.resolve4(domain)
    case 'AAAA':
      return dns.resolve6(domain)
    case 'CNAME':
      return dns.resolveCname(domain)
    case 'MX':
      return (await dns.resolveMx(domain)).map(r => r.exchange)
    case 'TXT':
      return (await dns.resolveTxt(domain)).map(arr => arr.join(''))
    case 'NS':
      return dns.resolveNs(domain)
    default:
      throw new Error(`Unsupported record type: ${type}`)
  }
}

async function tryResolveMatch(
  domain: string,
  type: string,
  target: string,
): Promise<boolean> {
  try {
    console.log(`Resolving ${type} records for ${domain} to match ${target}`)
    const results = await resolveRecord(domain, type)
    console.log({ results })
    return results.some(r => r.toLowerCase() === target.toLowerCase())
  } catch (error) {
    console.log('Error resolving records: ', error)
    return false
  }
}

export async function checkDNSConfig(
  domain: string,
  type: string,
  target: string,
): Promise<boolean> {
  try {
    // Step 1: get authoritative nameservers
    const nsRecords = await dns.resolveNs(domain)

    console.log({ nsRecords })

    if (nsRecords.length > 0) {
      console.log('Ns Records found, querying registrar NS directly')
      try {
        dns.setServers(nsRecords) // query registrar NS directly
        const result = await tryResolveMatch(domain, type, target)
        if (result) return true
      } catch {
        // ignore and fall back
        console.log('Error querying registrar NS, falling back to public DNS')
      }
    }

    // Step 2: fallback to public resolvers
    dns.setServers(PUBLIC_DNS_SERVERS)
    return await tryResolveMatch(domain, type, target)
  } catch {
    console.log('Error checking DNS configuration')
    return false
  }
}
