'use client';

import { ThemeProvider } from 'next-themes';
import NextTopLoader from 'nextjs-toploader';
import type { PropsWithChildren } from 'react';
import { Toaster } from '@/components/sonner';

export function Provider({ children }: PropsWithChildren) {
  return (
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
  );
}
