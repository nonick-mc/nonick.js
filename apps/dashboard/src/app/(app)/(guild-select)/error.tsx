'use client';

import { Alert } from '@heroui/react';

export default function ErrorPage() {
  return (
    <Alert
      classNames={{
        base: 'flex-col gap-6 items-center py-8',
        iconWrapper: 'w-[60px] h-[60px]',
        alertIcon: 'h-10 w-10',
        mainWrapper: 'text-center ms-0',
        title: 'text-md',
      }}
      title='予期しないエラーが発生しました'
      description='時間を置いて再度アクセスしてください。'
      color='danger'
      variant='faded'
    />
  );
}
