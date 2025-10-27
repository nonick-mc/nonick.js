'use client';

import { ThemeProvider } from 'next-themes';
import NextTopLoader from 'nextjs-toploader';
import type { PropsWithChildren } from 'react';
import { Toaster } from '@/components/ui/sonner';

export function Provider({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
      <NextTopLoader color='#2563eb' showSpinner={false} />
      <Toaster
        position='top-center'
        toastOptions={{
          classNames: {
            error: '!border-destructive !text-destructive',
          },
        }}
      />
      {children}
    </ThemeProvider>
  );
}
