import { Button } from '@repo/ui/components/button';
import { Safari } from '@repo/ui/components/shadcn-io/safari';
import { ArrowRightIcon, LayoutDashboardIcon } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { Links } from '@/lib/constants';

export function HeroSection() {
  return (
    <section className='pt-32'>
      <div className='container text-center'>
        <div className='flex flex-col gap-5'>
          <div className='flex flex-col gap-5'>
            <div className='mx-auto flex max-w-5xl flex-col gap-6'>
              <h1 className='text-3xl font-bold lg:text-6xl'>
                あなたのDiscordサーバーを
                <br />
                もっと<span className='text-primary'>便利</span>に。
              </h1>
              <p className='text-muted-foreground text-balance lg:text-lg'>
                NoNICK.jsは、サーバー運営のサポートに特化した次世代のDiscordBotです。サーバー運営に関する便利な機能を幅広く搭載しています。
              </p>
            </div>
            <div className='pt-2 pb-12 flex justify-center gap-3'>
              <Button asChild size='lg'>
                <Link href={'/docs' as Route}>
                  <ArrowRightIcon className='relative size-4' />
                  <span className='text-nowrap'>はじめる</span>
                </Link>
              </Button>
              <Button size='lg' variant='outline' asChild>
                <Link href={Links.Dashboard} target='_blank'>
                  <LayoutDashboardIcon className='relative size-4' />
                  <span className='text-nowrap'>ダッシュボード</span>
                </Link>
              </Button>
            </div>
          </div>
          <div className='mask-b-from-80% w-full'>
            <Safari
              className='w-full h-auto hidden dark:block'
              mode='simple'
              url='dashboard.nonick-js.com'
              imageSrc='/app-screenshot-dark.png'
              width={1202}
            />
            <Safari
              className='w-full h-auto block dark:hidden'
              mode='simple'
              url='dashboard.nonick-js.com'
              imageSrc='/app-screenshot-light.png'
              width={1202}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
