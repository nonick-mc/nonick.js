import { Logo } from '@/components/logo';
import { UserDropdown, UserDropdownSkeleton } from '@/components/user-dropdown';
import { auth } from '@/lib/auth';
import { Chip } from '@heroui/chip';
import { Link } from '@heroui/link';
import { Navbar as HeroUINavbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/navbar';
import { Suspense } from 'react';

export async function Navbar() {
  const sessionPromise = auth();

  return (
    <HeroUINavbar maxWidth='xl' height={80}>
      <NavbarBrand className='gap-4'>
        <Link href='#'>
          <Logo height={16} />
        </Link>
        <Chip className='max-sm:hidden' size='sm' radius='sm' variant='flat'>
          Dashboard
        </Chip>
      </NavbarBrand>
      <NavbarContent justify='end'>
        <NavbarItem>
          <Suspense fallback={<UserDropdownSkeleton />}>
            <UserDropdown sessionPromise={sessionPromise} />
          </Suspense>
        </NavbarItem>
      </NavbarContent>
    </HeroUINavbar>
  );
}
