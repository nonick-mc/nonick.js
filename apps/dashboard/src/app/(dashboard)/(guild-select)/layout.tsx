import { InviteButton } from './invite-button';
import { Navbar } from './navbar';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <Navbar />
      <div className='py-8 border-b'>
        <div className='container flex flex-col gap-6 md:flex-row md:items-center'>
          <section className='flex flex-col text-center md:flex-1 md:text-start'>
            <p className='text-2xl font-bold'>サーバー選択</p>
            <p className='max-sm:text-sm text-md text-muted-foreground'>
              NoNICK.jsの設定を行うサーバーを選択してください。
            </p>
          </section>
          <InviteButton />
        </div>
      </div>
      <div className='container py-8'>{children}</div>
    </>
  );
}
