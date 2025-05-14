CREATE TABLE "report" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guild_id" text NOT NULL,
	"channel_id" text NOT NULL,
	"thread_id" text NOT NULL,
	"target_user_id" text NOT NULL,
	"target_channel_id" text NOT NULL,
	"target_message_id" text NOT NULL,
	"create_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "audit_log" ALTER COLUMN "guild_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "public_setting"."report" ALTER COLUMN "channel" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "public_setting"."report" ADD COLUMN "forum_completed_tag" text;--> statement-breakpoint
ALTER TABLE "public_setting"."report" ADD COLUMN "forum_ignored_tag" text;--> statement-breakpoint
ALTER TABLE "public_setting"."report" ADD COLUMN "show_moderate_log" boolean; --> statement-breakpoint
UPDATE "public_setting"."report" SET "show_moderate_log" = true; --> statement-breakpoint
ALTER TABLE "public_setting"."report" ALTER COLUMN "show_moderate_log" SET NOT NULL; --> statement-breakpoint
ALTER TABLE "report" ADD CONSTRAINT "report_guild_id_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "public"."guild"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "public_setting"."report" DROP COLUMN "show_progress_button";
