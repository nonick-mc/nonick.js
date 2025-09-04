'use client';

import { ChevronsUpDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { UserDropdownMenuContent } from '@/components/user-dropdown-menu';
import { authClient } from '@/lib/auth-client';

export function UserDropdown() {
  const { data: session } = authClient.useSession();
  const { isMobile } = useSidebar();

  if (!session) {
    return <Skeleton className='h-12' />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size='lg'
          className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
        >
          <Avatar className='size-8 rounded-md'>
            <AvatarImage src={session?.user.image ?? undefined} alt={`@${session?.user.name}`} />
            <AvatarFallback>
              {session?.user.globalName?.slice(0, 2) ?? session?.user.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className='grid flex-1 text-left text-sm leading-tight'>
            <span className='truncate font-medium'>
              {session.user.globalName ?? session.user.name}
            </span>
            <span className='truncate text-xs text-muted-foreground'>@{session.user.name}</span>
          </div>
          <ChevronsUpDown className='ml-auto' />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' side={isMobile ? 'bottom' : 'right'} className='w-56'>
        <UserDropdownMenuContent />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
