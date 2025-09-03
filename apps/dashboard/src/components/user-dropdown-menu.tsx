'use client';

import { LayoutDashboardIcon, LogInIcon, PaintbrushIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { authClient } from '@/lib/auth-client';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from './ui/dropdown-menu';
import { Skeleton } from './ui/skeleton';

export function UserDropdownMenuContent() {
  const { data: session } = authClient.useSession();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  return (
    <>
      <DropdownMenuLabel>
        {session ? (
          <div className='flex gap-2 items-center'>
            <Avatar className='size-8 rounded-md'>
              <AvatarImage src={session?.user.image ?? undefined} alt={`@${session.user.name}`} />
              <AvatarFallback>{session.user.globalName ?? session.user.name}</AvatarFallback>
            </Avatar>
            <div className='grid flex-1 text-left text-sm leading-tight'>
              <span className='truncate font-medium'>
                {session.user.globalName ?? session.user.name}
              </span>
              <span className='truncate text-xs text-muted-foreground'>@{session.user.name}</span>
            </div>
          </div>
        ) : (
          <Skeleton className='h-8' />
        )}
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem onClick={() => router.push('/')}>
          <LayoutDashboardIcon />
          ダッシュボード
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className='flex gap-2 [&_svg]:size-4'>
            <PaintbrushIcon className='stroke-muted-foreground' />
            テーマ
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={theme} onValueChange={(v) => setTheme(v)}>
              <DropdownMenuRadioItem value='system'>システム</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='light'>ライト</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='dark'>ダーク</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem
          onClick={async () =>
            await authClient.signOut({
              fetchOptions: {
                onSuccess: () => router.refresh(),
              },
            })
          }
          variant='destructive'
          disabled={!session}
        >
          <LogInIcon />
          ログアウト
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </>
  );
}
