import { env } from '@env'
import payloadConfig from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

// --- Configuration ---
const MAIN_DOMAIN =
  env.NEXT_PUBLIC_WEBSITE_URL?.replace(/^https?:\/\//, '') || ''

const RESERVED_PATHS = [
  '/admin',
  '/sign-in',
  '/sign-up',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/api',
  '/.next',
  '/_next',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/images',
  '/assets',
  '/public',
]

const STATIC_EXTENSIONS = [
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.svg',
  '.ico',
  '.css',
  '.js',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
  '.pdf',
  '.zip',
  '.mp4',
  '.webm',
]

function isStaticFile(pathname: string): boolean {
  return STATIC_EXTENSIONS.some(ext => pathname.toLowerCase().endsWith(ext))
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  const { pathname } = url
  const hostname = req.headers.get('host')

  console.log({ hostname, pathname, MAIN_DOMAIN })

  if (!hostname) {
    return new Response(null, {
      status: 400,
      statusText: 'No hostname provided',
    })
  }

  // Allow static files to pass through immediately
  if (isStaticFile(pathname)) {
    return NextResponse.next()
  }

  // Allow reserved paths to pass through without changes
  if (RESERVED_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  const currentHost = hostname.replace(/:\d+$/, '') // Remove port

  // Check if this is the main domain (including localhost)
  const isMainDomain =
    currentHost === 'localhost' || currentHost === MAIN_DOMAIN

  // Check if this is a subdomain of the main domain
  const isSubdomain = !isMainDomain && currentHost.endsWith(`.${MAIN_DOMAIN}`)

  // If it's neither main domain nor subdomain, it must be a custom domain
  const isCustomDomain = !isMainDomain && !isSubdomain

  console.log({ currentHost, isMainDomain, isSubdomain, isCustomDomain })

  // Initialize payload only when needed
  const payload = await getPayload({ config: payloadConfig })

  // --- Handle Custom Domains ---
  if (isCustomDomain) {
    console.log('Checking custom domain:', currentHost)

    const { docs } = await payload.find({
      collection: 'customDomains',
      where: {
        and: [
          { hostname: { equals: currentHost } },
          { verified: { equals: true } },
        ],
      },
      depth: 1,
    })

    console.log('Custom domain docs:', docs)

    if (docs.length === 0) {
      return new Response('Domain not configured or not verified', {
        status: 404,
      })
    }

    const domain = docs[0]
    const tenant = domain?.tenant

    if (!tenant || typeof tenant !== 'object' || !tenant.slug) {
      return new Response('Invalid domain configuration', {
        status: 500,
      })
    }

    // Rewrite to tenant path
    url.pathname = `/${tenant.slug}${pathname}`
    console.log('Rewriting custom domain to:', url.pathname)

    return NextResponse.rewrite(url)
  }

  // --- Handle Main Domain ---
  if (isMainDomain) {
    // Root path is accessible
    if (pathname === '/') {
      return NextResponse.next()
    }

    // Treat first segment as tenant and redirect to subdomain
    const tenant = pathname.split('/')[1]
    if (tenant) {
      const pathSuffix = pathname.substring(
        pathname.indexOf(tenant) + tenant.length,
      )
      const protocol = currentHost === 'localhost' ? 'http' : 'https'
      const port = currentHost === 'localhost' ? ':3000' : ''

      const redirectUrl = `${protocol}://${tenant}.${currentHost}${port}${pathSuffix}`
      console.log('Redirecting main domain to subdomain:', redirectUrl)

      return NextResponse.redirect(redirectUrl)
    }
  }

  // --- Handle Subdomains ---
  if (isSubdomain) {
    const tenantFromSubdomain = currentHost.split('.')[0]

    if (tenantFromSubdomain === 'www') {
      // Redirect www to non-www
      const protocol = 'https'
      const redirectUrl = `${protocol}://${MAIN_DOMAIN}${pathname}`
      return NextResponse.redirect(redirectUrl)
    }

    // Check if this subdomain has a custom domain mapping
    const { docs } = await payload.find({
      collection: 'customDomains',
      where: {
        and: [
          { hostname: { equals: currentHost } },
          { verified: { equals: true } },
        ],
      },
      depth: 1,
    })

    console.log('Subdomain custom domain check:', docs)

    if (docs.length > 0) {
      const domain = docs[0]
      const tenant = domain?.tenant

      if (tenant && typeof tenant === 'object' && tenant.slug) {
        url.pathname = `/${tenant.slug}${pathname}`
        console.log('Rewriting subdomain with custom domain to:', url.pathname)
        return NextResponse.rewrite(url)
      }
    }

    // Default subdomain routing
    url.pathname = `/${tenantFromSubdomain}${pathname}`
    console.log('Rewriting subdomain to:', url.pathname)

    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  runtime: 'nodejs',
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|woff|woff2|ttf|eot|pdf|zip|mp4|webm)$).*)',
  ],
}
