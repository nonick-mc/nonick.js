import { Logo } from '@/components/logo';
import { UserDropdown } from '@/components/user-dropdown';
import { NavbarBrand, NavbarContent, NavbarItem, Navbar as NextUINavbar } from '@nextui-org/navbar';
import type { APIGuild } from 'discord-api-types/v10';
import Link from 'next/link';
import { SidebarModal } from './sidebar';

export function Navbar({ guild }: { guild: APIGuild }) {
  return (
    <NextUINavbar maxWidth='xl' position='static'>
      <SidebarModal guild={guild} />
      <NavbarBrand as={Link} href='/'>
        <Logo height={18} />
      </NavbarBrand>
      <NavbarContent className='flex gap-2 items-center' justify='end'>
        <NavbarItem>
          <UserDropdown />
        </NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  );
}
