ALTER TABLE "user" ADD COLUMN "discord_user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_discord_user_id_unique" UNIQUE("discord_user_id");