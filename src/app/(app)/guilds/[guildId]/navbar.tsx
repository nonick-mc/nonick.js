'use client';

import { Icon } from '@/components/icon';
import { Logo } from '@/components/logo';
import { SidebarContext } from '@/components/sidebar-provider';
import { UserDropdown } from '@/components/user-dropdown';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';
import { Navbar as HeroUINavbar, NavbarContent, NavbarItem } from '@heroui/navbar';
import type { Session } from 'next-auth';
import { Suspense, useContext } from 'react';

export function Navbar({ sessionPromise }: { sessionPromise: Promise<Session | null> }) {
  const { onOpen } = useContext(SidebarContext);

  return (
    <HeroUINavbar
      position='sticky'
      classNames={{ wrapper: 'px-6 sm:px-8' }}
      height={80}
      maxWidth='full'
    >
      <NavbarContent justify='start'>
        <NavbarItem className='lg:hidden'>
          <Button isIconOnly size='sm' variant='light' onPress={onOpen}>
            <Icon className='text-default-500 text-2xl' icon='solar:hamburger-menu-outline' />
          </Button>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify='center'>
        <NavbarItem className='lg:hidden'>
          <Link href='/'>
            <Logo height={16} />
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify='end'>
        <NavbarItem>
          <Suspense>
            <UserDropdown sessionPromise={sessionPromise} />
          </Suspense>
        </NavbarItem>
      </NavbarContent>
    </HeroUINavbar>
  );
}
