import { SidebarInset, SidebarProvider } from '@repo/ui/components/sidebar';
import { cookies } from 'next/headers';
import { verifyDashboardAccessPermission } from '@/lib/dal';
import { AppSidebar } from './app-sidebar';
import { Navbar } from './navbar';

export default async function Layout({ params, children }: LayoutProps<'/guilds/[guildId]'>) {
  const { guildId } = await params;
  await verifyDashboardAccessPermission(guildId);

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 68)',
        } as React.CSSProperties
      }
    >
      <AppSidebar guildId={guildId} />
      <SidebarInset className='w-full'>
        <Navbar />
        <div className='p-6 lg:px-8 flex flex-col gap-6'>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
