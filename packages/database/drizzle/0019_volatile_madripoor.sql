-- データ移行: public_setting.auto_create_thread → public_rule.auto_create_thread
INSERT INTO "public_rule"."auto_create_thread" (
  "guild_id",
  "enabled",
  "channel_id",
  "thread_name",
  "auto_archive_duration",
  "ignore_roles",
  "ignore_bot",
  "create_at",
  "updated_at"
)
SELECT
  old."guild_id",
  old."enabled",
  unnest(old."channels") AS "channel_id",
  '![displayName]のスレッド' AS "thread_name",
  60 AS "auto_archive_duration", -- ThreadAutoArchiveDuration.OneHour = 60分
  ARRAY[]::text[] AS "ignore_roles",
  true AS "ignore_bot",
  old."create_at",
  old."updated_at"
FROM "public_setting"."auto_create_thread" old
ON CONFLICT ("guild_id", "channel_id") DO NOTHING;
--> statement-breakpoint
DROP TABLE "public_setting"."auto_create_thread" CASCADE;
