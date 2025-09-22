import Link from 'next/link';
import { Logo } from '@/components/logo';
import { UserDropdown } from '@/components/user-dropdown';

export function Navbar() {
  return (
    <header className='sticky top-0 bg-background z-50 w-full border-b'>
      <div className='container h-16 sticky top-0 z-50 flex items-center justify-between'>
        <Link href='/'>
          <Logo height={16} />
        </Link>
        <UserDropdown />
      </div>
    </header>
  );
}
