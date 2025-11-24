import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'
import { ThemeProvider } from 'next-themes'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import React from 'react'

import TRPCProvider from '@/trpc/TRPCProvider'

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <TRPCProvider>
      <ThemeProvider enableSystem attribute='class' enableColorScheme={false}>
        <ProgressBar
          height='2px'
          color='hsl(var(--primary))'
          options={{ showSpinner: false }}
          shallowRouting
        />
        <NuqsAdapter>{children}</NuqsAdapter>
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </TRPCProvider>
  )
}

export default Provider
