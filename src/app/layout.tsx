import './globals.css';
import { CheckSession } from '@/components/check-session';
import { ConsoleWarning } from '@/components/console-warn';
import { Toaster } from '@/components/ui/sonner';
import MetadataConfig from '@/config/metadata';
import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import { Provider } from './provider';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: MetadataConfig.name,
    template: `%s - ${MetadataConfig.name}`,
  },
  description: MetadataConfig.description,
  openGraph: {
    title: MetadataConfig.name,
    description: MetadataConfig.description,
    locale: 'ja_JP',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ja' suppressHydrationWarning>
      <body className={notoSansJP.className}>
        <Provider>
          <main>{children}</main>
          <Toaster />
          <NextTopLoader color='#006FEE' height={4} showSpinner={false} />
          <ConsoleWarning />
          <CheckSession />
        </Provider>
      </body>
    </html>
  );
}
