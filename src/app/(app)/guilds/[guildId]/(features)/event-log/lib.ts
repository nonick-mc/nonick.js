import { db } from '@/lib/drizzle';

export async function getLogSettings(guildId: string) {
  const logSettings = await Promise.all(
    [
      db.query.timeoutLogSetting,
      db.query.kickLogSetting,
      db.query.banLogSetting,
      db.query.voiceLogSetting,
      db.query.msgDeleteLogSetting,
      db.query.msgEditLogSetting,
    ].map((query) =>
      query.findFirst({
        where: (setting, { eq }) => eq(setting.guildId, guildId),
      }),
    ),
  );

  const [timeout, kick, ban, voice, msgDelete, msgEdit] = logSettings;
  return { timeout, kick, ban, voice, msgDelete, msgEdit };
}
