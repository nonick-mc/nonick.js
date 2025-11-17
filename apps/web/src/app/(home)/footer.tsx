import type { Route } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Links } from '@/lib/constants';

interface MenuItem {
  title: string;
  links: {
    text: string;
    url: string;
  }[];
}

const menuItems: MenuItem[] = [
  {
    title: 'Resources',
    links: [
      { text: 'ダッシュボード', url: Links.Dashboard },
      { text: 'ドキュメント', url: '/docs' },
      { text: 'サポートサーバー', url: Links.SupportServer },
      { text: 'ロードマップ', url: Links.Roadmap },
    ],
  },
  {
    title: 'Social',
    links: [
      { text: 'GitHub', url: 'https://github.com/nonick-mc/nonick.js' },
      { text: 'Twitter', url: 'https://x.com/nonick_mc' },
    ],
  },
];

const bottomLinks: { text: string; url: string }[] = [
  { text: '利用規約', url: '/tos' },
  { text: 'プライバシーポリシー', url: '/privacy-policy' },
];

export function Footer() {
  return (
    <section className='container max-w-6xl py-32'>
      <div className='container'>
        <footer>
          <div className='grid grid-cols-2 gap-8 lg:grid-cols-6'>
            <div className='col-span-2 mb-8 lg:mb-0'>
              <div className='flex items-center gap-2 lg:justify-start'>
                <Logo height={18} />
              </div>
              <p className='mt-4 font-bold'>あなたのDiscordサーバーをもっと便利に。</p>
            </div>
            {menuItems.map((section, sectionIdx) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: need to use index
              <div key={sectionIdx}>
                <h3 className='mb-4'>{section.title}</h3>
                <ul className='text-muted-foreground space-y-4'>
                  {section.links.map((link, linkIdx) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: need to use index
                    <li key={linkIdx} className='hover:text-primary'>
                      <Link href={link.url as Route}>{link.text}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className='text-muted-foreground mt-24 flex flex-col justify-between gap-4 border-t pt-8 text-sm font-medium md:flex-row md:items-center'>
            <p>© {new Date().getFullYear()} NoNICK.js. All rights reserved.</p>
            <ul className='flex gap-4'>
              {bottomLinks.map((link, linkIdx) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: need to use index
                <li key={linkIdx} className='hover:text-primary underline'>
                  <Link href={link.url as Route}>{link.text}</Link>
                </li>
              ))}
            </ul>
          </div>
        </footer>
      </div>
    </section>
  );
}
