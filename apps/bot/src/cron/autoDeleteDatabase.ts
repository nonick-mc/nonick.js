import { auditLog } from '@database/src/schema/audit-log';
import { report } from '@database/src/schema/report';
import { CronBuilder } from '@modules/cron';
import { db } from '@modules/drizzle';
import { lt } from 'drizzle-orm';

export default new CronBuilder({ minute: 0, hour: 0 }, async () => {
  const expireDate = new Date();
  expireDate.setDate(expireDate.getDate() - 28);

  await db.delete(auditLog).where(lt(auditLog.createdAt, expireDate));
  await db.delete(report).where(lt(report.createdAt, expireDate));
});
