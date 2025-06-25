ALTER TYPE "public"."levelup_notification_mode" ADD VALUE 'none' BEFORE 'current';--> statement-breakpoint
ALTER TABLE "public_setting"."level_system" DROP COLUMN "enable_levelup_notification";