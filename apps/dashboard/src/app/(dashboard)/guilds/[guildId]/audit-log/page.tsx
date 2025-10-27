import { InfoIcon } from 'lucide-react';
import type { Metadata } from 'next';
import { Header } from '@/components/header';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { verifyDashboardAccessPermission } from '@/lib/dal';
import { db } from '@/lib/drizzle';
import { colums } from './columns';
import { DataTable } from './data-table';

export const metadata: Metadata = {
  title: '監査ログ',
};

export default async function Page({ params }: PageProps<'/guilds/[guildId]/audit-log'>) {
  const { guildId } = await params;
  await verifyDashboardAccessPermission(guildId);

  const auditLogs = await db.query.auditLog.findMany({
    where: (log, { eq }) => eq(log.guildId, guildId),
    orderBy: (log, { desc }) => [desc(log.createdAt)],
    columns: {
      authorId: false,
    },
    with: {
      author: {
        columns: {
          name: true,
          globalName: true,
          image: true,
        },
      },
    },
  });

  return (
    <>
      <Header
        title='監査ログ'
        description='ユーザーがダッシュボードで加えた変更を閲覧することができます。'
      />
      <Alert variant='primary'>
        <InfoIcon />
        <AlertTitle>この機能はベータ版です。</AlertTitle>
        <AlertDescription>
          この機能は開発中です。搭載している内容について予告なく変更する場合があります。
        </AlertDescription>
      </Alert>
      <DataTable columns={colums} data={auditLogs} />
    </>
  );
}
