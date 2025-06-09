import { FadeInUp } from '@/components/animation';
import { getUser } from '@/lib/discord/api';
import { db } from '@/lib/drizzle';
import { requireDashboardAccessPermission } from '@/lib/permission';
import type { Metadata } from 'next';
import type { SettingPageProps } from '../types';
import { AuditLogTable } from './table';

export const metadata: Metadata = {
  title: '監査ログ',
};

export default async function Page({ params }: SettingPageProps) {
  const { guildId } = await params;
  await requireDashboardAccessPermission(guildId);

  const [auditLogs] = await Promise.all([
    db.query.auditLog.findMany({
      where: (log, { eq }) => eq(log.guildId, guildId),
      orderBy: (log, { desc }) => [desc(log.createdAt)],
    }),
  ]);

  const uniqueAuthorIds = [...new Set(auditLogs.map((log) => log.authorId))];
  const authors = await Promise.all(uniqueAuthorIds.map((authorId) => getUser(authorId)));

  return (
    <FadeInUp>
      <AuditLogTable auditLogs={auditLogs} authors={authors} />
    </FadeInUp>
  );
}
