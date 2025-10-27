import { Logo } from '@/components/logo';
import { UserDropdown } from '@/components/user-dropdown';

export function Navbar() {
  return (
    <nav className='sticky top-0 z-10 px-6 flex items-center justify-between h-16 bg-background border-b'>
      <Logo height={17} />
      <UserDropdown />
    </nav>
  );
}
