import type { Metadata, Viewport } from 'next';
import { Geist_Mono, Noto_Sans_JP } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { cn } from '@/lib/utils';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: {
    default: 'NoNICK.js',
    template: '%s - NoNICK.js',
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
    <html
      lang='ja'
      suppressHydrationWarning
      className={cn('antialiased', geistMono.variable, 'font-sans', notoSansJP.variable)}
    >
      <body>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
