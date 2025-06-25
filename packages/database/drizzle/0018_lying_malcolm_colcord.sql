ALTER TABLE "public_setting"."level_system" ALTER COLUMN "levelup_notification_mode" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."levelup_notification_mode";--> statement-breakpoint
CREATE TYPE "public"."levelup_notification_mode" AS ENUM('current', 'specified');--> statement-breakpoint
ALTER TABLE "public_setting"."level_system" ALTER COLUMN "levelup_notification_mode" SET DATA TYPE "public"."levelup_notification_mode" USING "levelup_notification_mode"::"public"."levelup_notification_mode";--> statement-breakpoint
ALTER TABLE "public_setting"."level_system" ADD COLUMN "enable_levelup_notification" boolean NOT NULL;