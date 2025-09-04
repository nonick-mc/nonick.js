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
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
