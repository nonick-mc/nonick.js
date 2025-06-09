CREATE TYPE "public"."captcha_type" AS ENUM('button', 'image', 'web');--> statement-breakpoint
ALTER TYPE "public"."target_name" ADD VALUE 'verification';--> statement-breakpoint
CREATE TABLE "public_setting"."verification" (
	"guild_id" text PRIMARY KEY NOT NULL,
	"enabled" boolean NOT NULL,
	"role" text,
	"captcha_type" "captcha_type" NOT NULL,
	"create_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "public_setting"."verification" ADD CONSTRAINT "verification_guild_id_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "public"."guild"("id") ON DELETE cascade ON UPDATE no action;