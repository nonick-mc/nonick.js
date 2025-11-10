import { Button } from '@repo/ui/components/button';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { inviteBotUrl } from '@/lib/discord/constants';
import { Navbar } from './navbar';
import { SearchInput } from './search-input';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <Navbar />
      <div className='px-6 lg:px-12 py-6 flex flex-col gap-6'>
        <div className='flex max-sm:flex-col items-stretch justify-between gap-3'>
          <Suspense>
            <SearchInput />
          </Suspense>
          <Button size='lg' asChild>
            <Link href={inviteBotUrl}>
              <PlusIcon />
              サーバーを追加
            </Link>
          </Button>
        </div>
        {children}
      </div>
    </>
  );
}
