import { ChartLineIcon } from 'lucide-react';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { verifyDashboardAccessPermission } from '@/lib/dal';
import { GuildInfoCard, GuildInfoCardSkeleton } from './guild-info-card';

export const metadata: Metadata = {
  title: 'ダッシュボード',
};

export default async function Page({ params }: { params: { guildId: string } }) {
  const { guildId } = await params;
  await verifyDashboardAccessPermission(guildId);

  return (
    <>
      <Suspense fallback={<GuildInfoCardSkeleton />}>
        <GuildInfoCard guildId={guildId} />
      </Suspense>
      <Empty className='border'>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <ChartLineIcon />
          </EmptyMedia>
          <EmptyTitle>Coming Soon</EmptyTitle>
          <EmptyDescription>
            アップデート後、メンバー数やメッセージ数の増減をこのページで確認できるようになります。
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </>
  );
}
