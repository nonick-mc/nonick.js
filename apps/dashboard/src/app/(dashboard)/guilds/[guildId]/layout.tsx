import { cookies } from 'next/headers';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './app-sidebar';
import { Navbar } from './navbar';

export default async function Layout({ params, children }: LayoutProps<'/guilds/[guildId]'>) {
  const { guildId } = await params;
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
        } as React.CSSProperties
      }
      defaultOpen={defaultOpen}
    >
      <AppSidebar guildId={guildId} />
      <main className='flex-1'>
        <Navbar />
        {children}
      </main>
    </SidebarProvider>
  );
}
