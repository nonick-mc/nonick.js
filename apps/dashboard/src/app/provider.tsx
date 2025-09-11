'use client';

import { ThemeProvider } from 'next-themes';
import NextTopLoader from 'nextjs-toploader';
import type { PropsWithChildren } from 'react';

export function Provider({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute='class' defaultTheme='dark' enableSystem disableTransitionOnChange>
      <NextTopLoader color='#155dfc' showSpinner={false} />
      {children}
    </ThemeProvider>
  );
}
