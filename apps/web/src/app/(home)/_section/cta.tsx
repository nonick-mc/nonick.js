import { Button } from '@repo/ui/components/button';
import { Card } from '@repo/ui/components/card';
import { ArrowRightIcon } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';

export function CtaSection() {
  return (
    <section className='container max-w-6xl py-32'>
      <div className='container'>
        <Card className='flex w-full flex-col gap-16 overflow-hidden rounded-lg p-8 md:rounded-xl lg:flex-row lg:items-center lg:p-12'>
          <div className='flex-1'>
            <h3 className='mb-3 text-2xl font-semibold md:mb-4 md:text-4xl lg:mb-6'>
              NoNICK.jsを導入しよう
            </h3>
            <p className='text-muted-foreground max-w-xl lg:text-lg'>
              NoNICK.jsを使用して、あなたのDiscordサーバーをさらに便利にしましょう。無料で使用することができ、導入も簡単です。
            </p>
          </div>
          <div className='flex shrink-0 flex-col gap-2 sm:flex-row'>
            <Button asChild size='lg'>
              <Link href={'/docs' as Route}>
                <ArrowRightIcon />
                はじめる
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
