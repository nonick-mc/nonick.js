'use client';

import { Links } from '@/lib/constants';
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Skeleton,
  User,
} from '@heroui/react';
import type { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { use } from 'react';
import { Icon } from './icon';

export function UserDropdown({ sessionPromise }: { sessionPromise: Promise<Session | null> }) {
  const session = use(sessionPromise);
  if (!session) return <UserDropdownSkeleton />;

  return (
    <Dropdown placement='bottom-end'>
      <DropdownTrigger>
        <Avatar as='button' size='sm' src={session.user.image} showFallback />
      </DropdownTrigger>
      <DropdownMenu variant='flat'>
        <DropdownSection>
          <DropdownItem key='profile' textValue='profile' isReadOnly>
            <User
              name={session.user.name}
              description={
                session.user.discriminator === '0'
                  ? `@${session.user.username}`
                  : `${session.user.username} #${session.user.discriminator}`
              }
              avatarProps={{
                size: 'sm',
                src: `${session.user.image}?size=64`,
              }}
            />
          </DropdownItem>
        </DropdownSection>
        <DropdownSection showDivider>
          <DropdownItem
            key='dashboard'
            href='/'
            endContent={<Icon icon='solar:server-bold' className='text-default-500 text-xl' />}
          >
            サーバー選択
          </DropdownItem>
          <DropdownItem
            key='docs'
            as={'a'}
            href={Links.Docs}
            endContent={
              <Icon icon='solar:notebook-minimalistic-bold' className='text-default-500 text-xl' />
            }
          >
            ドキュメント
          </DropdownItem>
          <DropdownItem
            key='support'
            as={'a'}
            href={Links.Discord}
            endContent={<Icon icon='ic:baseline-discord' className='text-default-500 text-xl' />}
          >
            サポートサーバー
          </DropdownItem>
        </DropdownSection>
        <DropdownSection>
          <DropdownItem key='theme' isReadOnly endContent={<ThemeSelect />}>
            テーマ
          </DropdownItem>
          <DropdownItem
            key='logout'
            onPress={() => signOut()}
            endContent={<Icon icon='solar:logout-2-bold' className='text-default-500 text-xl' />}
          >
            ログアウト
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}

export function UserDropdownSkeleton() {
  return <Skeleton className='w-8 h-8 rounded-full' />;
}

function ThemeSelect() {
  const { theme, setTheme } = useTheme();

  return (
    <select
      className='text-tiny group-data-[hover=true]:border-default-500 border-small border-default-300
        dark:border-default-200 text-default-500 z-10 w-20 rounded-md
        bg-transparent py-0.5 outline-none'
      onChange={(e) => setTheme(e.target.value)}
      defaultValue={theme}
    >
      <option value='system'>システム</option>
      <option value='dark'>ダーク</option>
      <option value='light'>ライト</option>
    </select>
  );
}
