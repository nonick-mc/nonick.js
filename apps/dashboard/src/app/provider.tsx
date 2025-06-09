'use client';

import { HeroUIProvider, ToastProvider } from '@heroui/react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { useRouter } from 'next/navigation';
import NextTopLoader from 'nextjs-toploader';
import { type ReactNode, useEffect } from 'react';

export function Provider({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    console.log('%cストップ！', 'font-size: 4rem; color: red');
    console.log(
      '%cここに何かを貼り付けると、あなたのアカウントが危険にさらされる可能性があります!',
      'font-size: 1rem; color: orange',
    );
    console.log(
      '%c自分が何をしようとしているか理解していないのなら、何も入力せずウィンドウを閉じるべきです。',
      'font-size: 1rem',
    );
  }, []);

  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <ThemeProvider attribute='class' defaultTheme='dark'>
        <HeroUIProvider navigate={router.push} spinnerVariant='spinner'>
          {children}
          <NextTopLoader color='#006FEE' height={4} showSpinner={false} />
          <ToastProvider placement='top-right' toastProps={{ variant: 'flat' }} toastOffset={80} />
        </HeroUIProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
