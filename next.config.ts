import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/public': ['./public/**/*'],
  },
  experimental: {
    reactCompiler: false,
  },
  output: 'standalone',
  reactStrictMode: true,

  // async redirects() {
  //   return [
  //     // Handle specific redirection routes for subdomains
  //     {
  //       source: '/:tenant/profile',
  //       destination: '/profile',
  //       has: [
  //         {
  //           type: 'host',
  //           // Match any subdomain (excluding root domain)
  //           value: '^(?<tenant>[^.]+)\\..+$',
  //         },
  //       ],
  //       permanent: false,
  //     },
  //   ]
  // },

  // async rewrites() {
  //   return [
  //     // Localhost development: subdomain.localhost:3000
  //     {
  //       source:
  //         '/:path((?!admin|sign-in|sign-up|forgot-password|reset-password|verify-email|api|_next).*)',
  //       destination: '/:tenant/:path*',
  //       has: [
  //         {
  //           type: 'host',
  //           value: '^(?<tenant>[^.]+)\\.localhost(:\\d+)?$',
  //         },
  //       ],
  //     },
  //     // Root paths for localhost (catch-all for non-matching paths)
  //     {
  //       source:
  //         '/:path((?!admin|sign-in|sign-up|forgot-password|reset-password|verify-email|api|_next).*)',
  //       destination: '/:tenant',
  //       has: [
  //         {
  //           type: 'host',
  //           value: '^(?<tenant>[^.]+)\\.localhost(:\\d+)?$',
  //         },
  //         {
  //           type: 'query',
  //           key: 'path',
  //           value: '^$',
  //         },
  //       ],
  //     },

  //     // Production: subdomain.yourdomain.com
  //     {
  //       source:
  //         '/:path((?!admin|sign-in|sign-up|forgot-password|reset-password|verify-email|api|_next).*)',
  //       destination: '/:tenant/:path*',
  //       has: [
  //         {
  //           type: 'host',
  //           // Replace 'yourdomain.com' with your actual domain
  //           value: '^(?<tenant>[^.]+)\\.yourdomain\\.com$',
  //         },
  //       ],
  //     },
  //     // Root paths for production
  //     {
  //       source:
  //         '/:path((?!admin|sign-in|sign-up|forgot-password|reset-password|verify-email|api|_next).*)',
  //       destination: '/:tenant',
  //       has: [
  //         {
  //           type: 'host',
  //           value: '^(?<tenant>[^.]+)\\.yourdomain\\.com$',
  //         },
  //         {
  //           type: 'query',
  //           key: 'path',
  //           value: '^$',
  //         },
  //       ],
  //     },
  //   ]
  // },
}

export default withPayload(nextConfig)
