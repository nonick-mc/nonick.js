import type { PropsWithChildren } from 'react';
import { InviteButton } from './invite-button';
import { Navbar } from './navbar';
import { SearchInput } from './search-input';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar />
      <div className='py-8 border-b'>
        <div className='container flex flex-col gap-6 md:flex-row md:items-center'>
          <section className='flex flex-col text-center md:flex-1 md:text-start'>
            <p className='text-2xl font-bold'>サーバー選択</p>
            <p className='text-sm text-muted-foreground'>
              NoNICK.jsの設定を行うサーバーを選択してください。
            </p>
          </section>
          <div className='flex flex-col gap-3 md:flex-row md:flex-1'>
            <SearchInput />
            <InviteButton />
          </div>
        </div>
      </div>
      <div className='container py-6'>{children}</div>
    </>
  );
}
