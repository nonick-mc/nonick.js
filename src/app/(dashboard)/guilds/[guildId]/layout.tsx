import { getGuild } from '@/lib/discord';
import type { ReactNode } from 'react';
import { Navbar } from './navbar';
import { Sidebar } from './sidebar';

type LayoutProps = {
  children: ReactNode;
  params: { guildId: string };
};

export default async function Layout({ children, params: { guildId } }: LayoutProps) {
  const guild = await getGuild(guildId);

  return (
    <>
      <Navbar guild={guild} />
      <div className='flex gap-8 container'>
        <Sidebar
          guild={guild}
          className='sticky top-16 h-[calc(100dvh_-_64px)] pt-4 max-lg:hidden'
        />
        <div className='flex-1 flex flex-col gap-6 mt-4'>{children}</div>
      </div>
    </>
  );
}
