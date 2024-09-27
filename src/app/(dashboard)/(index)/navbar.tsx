import { Logo } from '@/components/logo';
import { UserDropdown } from '@/components/user-dropdown';
import { NavbarBrand, NavbarContent, NavbarItem, Navbar as NextUINavbar } from '@nextui-org/navbar';

export function Navbar() {
  return (
    <NextUINavbar maxWidth='xl' position='static'>
      <NavbarBrand>
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
