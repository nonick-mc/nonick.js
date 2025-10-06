'use client';

import {
  BookOpenIcon,
  LayoutPanelLeftIcon,
  LifeBuoyIcon,
  LogInIcon,
  PaintbrushIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { authClient } from '@/lib/auth-client';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
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
} from './ui/dropdown-menu';
import { Skeleton } from './ui/skeleton';

export function UserDropdown() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { data: session } = authClient.useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className='size-8'>
          <AvatarImage src={session?.user.image ?? undefined} alt={`@${session?.user.name}`} />
          <AvatarFallback>
            {session?.user.globalName?.slice(0, 2) ?? session?.user.name.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuLabel>
          {session ? (
            <div className='flex gap-3 items-center'>
              <Avatar>
                <AvatarImage
                  className='rounded-lg bg-muted'
                  // biome-ignore lint: false positive
                  src={session.user.image!}
                  alt={`@${session.user.name}`}
                />
                <AvatarFallback>{session.user.globalName ?? session.user.name}</AvatarFallback>
              </Avatar>
              <section className='leading-tight text-sm'>
                <p className='text-foreground'>{session.user.globalName ?? session.user.name}</p>
                <p className='text-muted-foreground'>@{session.user.name}</p>
              </section>
            </div>
          ) : (
            <Skeleton className='h-11' />
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={'/'}>
              <LayoutPanelLeftIcon />
              ダッシュボード
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
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
          <DropdownMenuItem asChild>
            <Link href={'https://docs.nonick-js.com'} target='_blank' rel='noopener noreferrer'>
              <BookOpenIcon />
              ドキュメント
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={'https://discord.gg/q4FcBm2P42'} target='_blank' rel='noopener noreferrer'>
              <LifeBuoyIcon />
              サポートサーバー
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={async () =>
              await authClient.signOut({
                fetchOptions: {
                  onSuccess: () => router.push('/login'),
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
