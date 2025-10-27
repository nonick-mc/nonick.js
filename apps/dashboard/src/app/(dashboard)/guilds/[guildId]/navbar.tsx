import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserDropdown } from '@/components/user-dropdown';
import { NavbarBreadcrumb } from './navbar-breadcrumb';

export function Navbar() {
  return (
    <nav className='sticky top-0 z-10 px-6 flex items-center justify-between h-16 border-b bg-background'>
      <div className='flex items-center gap-2'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mr-2 data-[orientation=vertical]:h-4' />
        <NavbarBreadcrumb />
      </div>
      <UserDropdown />
    </nav>
  );
}
