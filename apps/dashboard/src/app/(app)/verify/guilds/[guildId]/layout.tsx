import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className='container h-dvh flex items-center justify-center'>
      <div className='max-w-[400px] w-full flex items-center justify-center'>{children}</div>
    </div>
  );
}
