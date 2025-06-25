ALTER TYPE "public"."target_name" ADD VALUE 'level_system';--> statement-breakpoint
ALTER TABLE "public_setting"."level_system" ADD COLUMN "enable_levelup_notification" boolean NOT NULL;