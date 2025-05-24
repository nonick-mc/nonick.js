'use client';

import { FadeInUp } from '@/components/animation';
import { Header } from '@/components/header';
import { useSelectedLayoutSegment } from 'next/navigation';
import type { PropsWithChildren } from 'react';

const titleMap = new Map<string, string>([
  ['(dashboard)', 'ダッシュボード'],
  ['audit-log', '監査ログ'],
  ['auto-change-verification-level', '自動認証レベル変更'],
  ['auto-create-thread', '自動スレッド作成'],
  ['auto-public', '自動アナウンス公開'],
  ['automod-plus', 'AutoMod Plus'],
  ['event-log', 'イベントログ'],
  ['join-message', '入室メッセージ'],
  ['leave-message', '退室メッセージ'],
  ['message-expand', 'メッセージURL展開'],
  ['report', 'サーバー内通報'],
  ['verification', 'メンバー認証'],
]);

export default function Template({ children }: PropsWithChildren) {
  const segment = useSelectedLayoutSegment();
  const title = titleMap.get(segment as string);

  return (
    <FadeInUp className='flex flex-col gap-6'>
      <Header title={title} />
      {children}
    </FadeInUp>
  );
}
