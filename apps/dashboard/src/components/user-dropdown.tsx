'use client';

import { LayoutDashboardIcon, LogInIcon, PaintbrushIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { authClient } from '@/lib/auth-client';
import { Skeleton } from './ui/skeleton';

export function UserDropdown() {
  const { data: session } = authClient.useSession();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

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
        <DropdownMenuLabel>
          {session ? (
            <div className='flex gap-2 items-center'>
              <Avatar className='size-8 rounded-md'>
                <AvatarImage src={session?.user.image ?? undefined} alt={`@${session.user.name}`} />
                <AvatarFallback>{session.user.globalName ?? session.user.name}</AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='text-foreground truncate font-medium'>
                  {session.user.globalName ?? session.user.name}
                </span>
                <span className='truncate text-xs'>@{session.user.name}</span>
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
              <PaintbrushIcon />
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
            disabled={!session}
          >
            <LogInIcon />
            ログアウト
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
