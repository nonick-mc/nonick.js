'use client';

import { Avatar } from '@nextui-org/avatar';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/dropdown';
import { Skeleton } from '@nextui-org/skeleton';
import { User } from '@nextui-org/user';
import { signOut, useSession } from 'next-auth/react';

export function UserDropdown() {
  const { data: session } = useSession();

  if (!session) {
    return <Skeleton className='w-8 h-8 rounded-full' />;
  }

  return (
    <Dropdown placement='bottom-end'>
      <DropdownTrigger>
        <Avatar
          as='button'
          size='sm'
          name={session.user.name}
          src={session.user.image}
          showFallback
        />
      </DropdownTrigger>
      <DropdownMenu variant='flat'>
        <DropdownItem textValue='profile' isReadOnly>
          <User
            name={session.user.name}
            description='Discordアカウント'
            avatarProps={{
              size: 'sm',
              src: session.user.image,
            }}
          />
        </DropdownItem>
        <DropdownItem
          onClick={() => signOut({ callbackUrl: '/login' })}
          color='danger'
          className='text-danger'
        >
          ログアウト
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
