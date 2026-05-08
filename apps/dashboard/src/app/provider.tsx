'use client';

import { Toaster } from '@repo/ui/components/sonner';
import { ThemeProvider } from 'next-themes';
import NextTopLoader from 'nextjs-toploader';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { PropsWithChildren } from 'react';

export function Provider({ children }: PropsWithChildren) {
  return (
    <NuqsAdapter>
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
        <NextTopLoader color='#2563eb' showSpinner={false} />
        <Toaster
          position='top-center'
          toastOptions={{
            classNames: {
              error: '!border-destructive !text-destructive',
              success: '!border-green-600 !text-green-600',
            },
          }}
        />
        {children}
      </ThemeProvider>
    </NuqsAdapter>
  );
}
