'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserDropdownMenuContent } from '@/components/user-dropdown-menu';
import { authClient } from '@/lib/auth-client';

export function UserDropdown() {
  const { data: session } = authClient.useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className='size-8 cursor-pointer'>
          <AvatarImage src={session?.user.image ?? undefined} alt={`@${session?.user.name}`} />
          <AvatarFallback>
            {session?.user.globalName?.slice(0, 2) ?? session?.user.name.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <UserDropdownMenuContent />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
