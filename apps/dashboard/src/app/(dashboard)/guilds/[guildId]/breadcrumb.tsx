'use client';

import type { Route } from 'next';
import Link from 'next/link';
import { useParams, useSelectedLayoutSegments } from 'next/navigation';
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Breadcrumb as ShadcnBreadcrumb,
} from '@/components/ui/breadcrumb';

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

export function Breadcrumb() {
  const { guildId } = useParams<{ guildId: string }>();
  const segments = useSelectedLayoutSegments().filter(
    (segment, index) => !(index !== 0 && /^[([]/.test(segment)),
  );

  console.log(segments);

  return (
    <ShadcnBreadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          if (segments.length - 1 === index) {
            return (
              <BreadcrumbItem key={segment}>
                <BreadcrumbPage>{toDisplayName(segment)}</BreadcrumbPage>
              </BreadcrumbItem>
            );
          }

          return (
            <>
              <BreadcrumbItem key={segment}>
                <BreadcrumbLink asChild>
                  <Link href={`/guilds/${guildId}/${segments.slice(0, index + 1)}` as Route}>
                    {toDisplayName(segment)}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          );
        })}
      </BreadcrumbList>
    </ShadcnBreadcrumb>
  );
}
