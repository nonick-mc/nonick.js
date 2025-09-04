import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { auth } from '@/lib/auth';
import { Header } from './header';
import { DashboardSidebar } from './sidebar';

export default async function Layout({ params, children }: LayoutProps<'/guilds/[guildId]'>) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/login');

  const { guildId } = await params;

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <DashboardSidebar guildId={guildId} />
      <SidebarInset>
        <Header />
        <div className='flex flex-1 flex-col'>
          <div className='@container/main flex flex-1 flex-col gap-2'>
            <div className='flex flex-col gap-4 px-4 lg:px-6 py-4 md:gap-6 md:py-6'>{children}</div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
