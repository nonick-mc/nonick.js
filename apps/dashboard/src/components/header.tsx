import type React from 'react';

type HeaderProps = {
  title: React.ReactNode;
  description: React.ReactNode;
};

export function Header({ title, description }: HeaderProps) {
  return (
    <div className='flex flex-col gap-1'>
      <h1 className='scroll-m-20 font-bold tracking-tight text-xl sm:text-2xl'>{title}</h1>
      <p className='text-muted-foreground text-balance text-sm'>{description}</p>
    </div>
  );
}
