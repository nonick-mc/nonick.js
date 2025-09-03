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
import { Skeleton } from '@/components/ui/skeleton';
import { authClient } from '@/lib/auth-client';

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
              <Avatar className='size-8'>
                <AvatarImage src={session?.user.image ?? undefined} alt={`@${session.user.name}`} />
                <AvatarFallback>{session.user.globalName ?? session.user.name}</AvatarFallback>
              </Avatar>
              <section className='leading-tight'>
                <p className='text-foreground text-sm'>
                  {session.user.globalName ?? session.user.name}
                </p>
                <p className='text-zinc-500 text-xs'>@{session.user.name}</p>
              </section>
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
