CREATE TABLE "levels" (
	"user_id" text NOT NULL,
	"guild_id" text,
	"level" integer DEFAULT 0 NOT NULL,
	"xp" integer DEFAULT 0 NOT NULL,
	"boost" integer DEFAULT 1 NOT NULL,
	"create_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "levels_user_id_guild_id_pk" PRIMARY KEY("user_id","guild_id")
);
--> statement-breakpoint
CREATE TABLE "public_setting"."level_system" (
	"guild_id" text PRIMARY KEY NOT NULL,
	"enabled" boolean NOT NULL,
	"rewards" jsonb[] NOT NULL,
	"boosts" jsonb[] NOT NULL,
	"deny_channels" text[] NOT NULL,
	"allow_thread_channels" text[] NOT NULL
);
--> statement-breakpoint
ALTER TABLE "levels" ADD CONSTRAINT "levels_guild_id_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "public"."guild"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "public_setting"."level_system" ADD CONSTRAINT "level_system_guild_id_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "public"."guild"("id") ON DELETE cascade ON UPDATE no action;