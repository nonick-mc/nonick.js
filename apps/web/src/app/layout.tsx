import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';

export const metadata: Metadata = {
  title: {
    default: 'NoNICK.js',
    template: '%s - NoNICK.js',
  },
  description: 'あなたのDiscordサーバーをもっと便利に。',
};

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
});

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang='ja' className={notoSansJP.className} suppressHydrationWarning>
      <body className='flex flex-col min-h-screen'>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
