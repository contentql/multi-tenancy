import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <main className='bg-background flex min-h-screen items-center justify-center'>
      <div className='mx-auto max-w-4xl space-y-8 px-4 text-center'>
        <div className='space-y-4'>
          <h1 className='text-foreground text-balance text-4xl font-bold md:text-6xl lg:text-7xl'>
            Multi-Tenant Platform
          </h1>
          <p className='text-muted-foreground mx-auto max-w-2xl text-balance text-lg md:text-xl'>
            Powerful multi-tenant architecture that scales with your business.
            Manage multiple clients, organizations, and workspaces from a
            single, unified platform.
          </p>
        </div>

        <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
          <Button asChild size='lg' className='px-8 py-6 text-lg'>
            <Link href='/sign-up'>Get Started</Link>
          </Button>
          <Button
            variant='outline'
            size='lg'
            className='bg-transparent px-8 py-6 text-lg'>
            <Link href={'/admin'}>Create Page</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
