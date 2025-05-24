import { SidebarProvider } from '@/components/sidebar-provider';
import { auth } from '@/lib/auth';
import { getGuild } from '@/lib/discord/api';
import { requireDashboardAccessPermission } from '@/lib/permission';
import type { ReactNode } from 'react';
import { Navbar } from './navbar';
import { Sidebar } from './sidebar';

export default async function Layout({
  children,
  params,
}: { children: ReactNode; params: Promise<{ guildId: string }> }) {
  const { guildId } = await params;
  await requireDashboardAccessPermission(guildId);

  const guildPromise = getGuild(guildId, false);
  const sessionPromise = auth();

  return (
    <SidebarProvider>
      <div className='flex'>
        <Sidebar guildPromise={guildPromise} />
        <div className='flex-1 flex flex-col h-dvh overflow-y-scroll'>
          <Navbar sessionPromise={sessionPromise} />
          <div className='max-w-[1100px] mx-auto w-full px-6 sm:px-8'>{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
}
