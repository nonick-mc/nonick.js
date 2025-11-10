import type { Metadata, Viewport } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import '@repo/ui/globals.css';
import type { PropsWithChildren } from 'react';
import { Provider } from './provider';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'NoNICK.js Dashboard',
    template: '%s - NoNICK.js Dashboard',
  },
  description: 'あなたのDiscordサーバーをもっと便利に。',
};

export const viewport: Viewport = {
  themeColor: '#0073f5',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang='ja' suppressHydrationWarning>
      <body className={`${notoSansJP.className} antialiased`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
