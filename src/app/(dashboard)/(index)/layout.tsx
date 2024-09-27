import { Header, HeaderDescription, HeaderTitle } from '@/components/header';
import type { ReactNode } from 'react';
import { Navbar } from './navbar';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <div className='container mt-6'>
        <Header className='mb-8'>
          <HeaderTitle>サーバー選択</HeaderTitle>
          <HeaderDescription>NoNICK.jsの設定を行いたいサーバーを選択してください</HeaderDescription>
        </Header>
        {children}
      </div>
    </>
  );
}
