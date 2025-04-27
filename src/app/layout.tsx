import type { Metadata, Viewport } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import './globals.css';
import { Provider } from './provider';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto-sans',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ja' suppressHydrationWarning>
      <body className={`${notoSansJP.className} antialiased`}>
        <Provider>
          <main>{children}</main>
        </Provider>
      </body>
    </html>
  );
}
