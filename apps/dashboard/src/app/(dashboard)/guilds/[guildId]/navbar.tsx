import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserDropdown } from '@/components/user-dropdown';

export function Navbar() {
  return (
    <nav className='sticky top-0 z-10 px-6 flex items-center justify-between h-16 bg-background border-b'>
      <SidebarTrigger />
      <UserDropdown />
    </nav>
  );
}
