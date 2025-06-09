'use client';

import { BreadcrumbItem, Breadcrumbs as HeroUIBreadcrumb } from '@heroui/react';
import { useParams, useSelectedLayoutSegments } from 'next/navigation';

const segmentLabelMap = new Map<string, string>([
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

function toDisplayName(segment: string): string {
  return (
    segmentLabelMap.get(segment) ||
    segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export function Breadcrumbs() {
  const { guildId } = useParams<{ guildId: string }>();
  const segments = useSelectedLayoutSegments().filter(
    (segment, index) => !(index !== 0 && /^[\(\[]/.test(segment)),
  );

  return (
    <HeroUIBreadcrumb
      itemClasses={{
        separator: 'text-xl sm:text-2xl font-extrabold sm:font-black px-2',
        item: 'text-2xl sm:text-3xl font-extrabold sm:font-black',
      }}
    >
      {segments.map((segment, index) => (
        <BreadcrumbItem key={segment} href={`/guilds/${guildId}/${segments.slice(0, index + 1)}`}>
          {toDisplayName(segment)}
        </BreadcrumbItem>
      ))}
    </HeroUIBreadcrumb>
  );
}
