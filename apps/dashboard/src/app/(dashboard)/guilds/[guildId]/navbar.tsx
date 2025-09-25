import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserDropdown } from '@/components/user-dropdown';

export function Navbar() {
  return (
    <header className='sticky top-0 bg-background z-50 w-full border-b'>
      <div className='container h-16 sticky top-0 z-50 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <SidebarTrigger />
        </div>
        <UserDropdown />
      </div>
    </header>
  );
}
