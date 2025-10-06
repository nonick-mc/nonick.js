import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './app-sidebar';
import { Navbar } from './navbar';

export default async function Layout({ params, children }: LayoutProps<'/guilds/[guildId]'>) {
  const { guildId } = await params;

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 68)',
        } as React.CSSProperties
      }
    >
      <AppSidebar guildId={guildId} />
      <main className='w-full'>
        <Navbar />
        <div className='p-6 flex flex-col gap-6'>{children}</div>
      </main>
    </SidebarProvider>
  );
}
