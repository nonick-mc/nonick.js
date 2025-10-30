CREATE SCHEMA "public_rule";
--> statement-breakpoint
CREATE TABLE "public_rule"."auto_create_thread" (
	"guild_id" text,
	"enabled" boolean DEFAULT true,
	"channel_id" text NOT NULL,
	"thread_name" text NOT NULL,
	"auto_archive_duration" integer NOT NULL,
	"ignore_roles" text[] NOT NULL,
	"create_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "auto_create_thread_guild_id_channel_id_pk" PRIMARY KEY("guild_id","channel_id")
);
--> statement-breakpoint
ALTER TABLE "public_rule"."auto_create_thread" ADD CONSTRAINT "auto_create_thread_guild_id_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "public"."guild"("id") ON DELETE cascade ON UPDATE no action;