ALTER TABLE "public_setting"."level_system" ADD COLUMN "enable_log" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "public_setting"."level_system" ADD COLUMN "log_channel" text;