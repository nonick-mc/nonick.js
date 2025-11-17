'use client';

import { Button } from '@repo/ui/components/button';
import type { CarouselApi } from '@repo/ui/components/carousel';
import { Carousel, CarouselContent, CarouselItem } from '@repo/ui/components/carousel';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface GalleryItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  image: string;
}

const items: GalleryItem[] = [
  {
    id: 'welcome-message',
    title: '入退室メッセージ',
    summary:
      'ユーザーがサーバーに参加・脱退した際にメッセージを送信して、メンバーを歓迎することができます。',
    url: '/docs/features/welcome-message',
    image: '/gallery/welcome-message.png',
  },
  {
    id: 'report',
    title: 'サーバー内通報',
    summary:
      'サーバーのルールに違反したメッセージを、サーバーの利用者が通報機能を使用して運営に報告することができます。',
    url: '/docs/features/report',
    image: '/gallery/report.png',
  },
  {
    id: 'log',
    title: 'イベントログ',
    summary:
      'タイムアウトやBAN、メッセージの削除や編集など、サーバーの様々なイベントの記録を送信することができます。',
    url: '/docs/features/log',
    image: '/gallery/log.png',
  },
  {
    id: 'verification',
    title: 'メンバー認証',
    summary: '特定のロールをボタン押下や画像認証、Web認証を通して付与させることができます。',
    url: '/docs/features/verification',
    image: '/gallery/verification.png',
  },
];

export function GallerySection() {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
    };
    updateSelection();
    carouselApi.on('select', updateSelection);
    return () => {
      carouselApi.off('select', updateSelection);
    };
  }, [carouselApi]);
  return (
    <section className='container max-w-6xl py-32'>
      <div className='container'>
        <div className='mb-8 flex flex-col justify-between md:mb-14 md:flex-row md:items-end lg:mb-16'>
          <div>
            <h2 className='mb-3 text-3xl font-semibold md:mb-4 md:text-4xl lg:mb-6'>
              搭載している機能
            </h2>
            <Link
              href={'/docs' as Route}
              className='group flex items-center gap-1 text-sm font-medium md:text-base lg:text-lg'
            >
              全ての機能を確認する
              <ArrowUpRight className='size-4 transition-transform group-hover:translate-x-1' />
            </Link>
          </div>
          <div className='mt-8 flex shrink-0 items-center justify-start gap-2'>
            <Button
              size='icon'
              variant='outline'
              onClick={() => {
                carouselApi?.scrollPrev();
              }}
              disabled={!canScrollPrev}
              className='disabled:pointer-events-auto'
            >
              <ArrowLeft className='size-5' />
            </Button>
            <Button
              size='icon'
              variant='outline'
              onClick={() => {
                carouselApi?.scrollNext();
              }}
              disabled={!canScrollNext}
              className='disabled:pointer-events-auto'
            >
              <ArrowRight className='size-5' />
            </Button>
          </div>
        </div>
      </div>
      <div className='w-full max-w-full'>
        <Carousel
          setApi={setCarouselApi}
          opts={{
            breakpoints: {
              '(max-width: 768px)': {
                dragFree: true,
              },
            },
          }}
          className='relative w-full max-w-full md:left-[-1rem]'
        >
          <CarouselContent className='hide-scrollbar w-full max-w-full'>
            {items.map((item) => (
              <CarouselItem key={item.id} className='ml-8 md:max-w-[452px]'>
                <Link href={item.url as Route} className='group flex flex-col justify-between'>
                  <div>
                    <div className='aspect-3/2 flex overflow-clip rounded-xl'>
                      <div className='flex-1'>
                        <div className='relative h-full w-full origin-bottom transition duration-300 group-hover:scale-105'>
                          <img
                            src={item.image}
                            alt={item.title}
                            className='h-full w-full object-cover object-center'
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='mb-2 line-clamp-3 break-words pt-4 text-lg font-bold md:mb-3 md:pt-4 md:text-xl lg:pt-4 lg:text-2xl'>
                    {item.title}
                  </div>
                  <div className='text-muted-foreground mb-8 line-clamp-2 text-sm md:mb-12 md:text-base lg:mb-9'>
                    {item.summary}
                  </div>
                  <div className='flex items-center text-sm'>
                    詳細を見る{' '}
                    <ArrowRight className='ml-2 size-5 transition-transform group-hover:translate-x-1' />
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
