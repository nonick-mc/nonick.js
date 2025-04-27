CREATE SCHEMA "public_setting";
--> statement-breakpoint
CREATE TYPE "public"."audit_log_action_type" AS ENUM('update_guild_setting');--> statement-breakpoint
CREATE TYPE "public"."audit_log_target_name" AS ENUM('guild', 'join_message', 'leave_message', 'report', 'timeout_log', 'kick_log', 'ban_log', 'voice_log', 'message_delete_log', 'message_edit_log', 'message_expand', 'auto_change_verify_level', 'auto_public', 'auto_create_thread', 'auto_mod');--> statement-breakpoint
CREATE TABLE "audit_log" (
	"guild_id" text PRIMARY KEY NOT NULL,
	"author_id" text NOT NULL,
	"target_name" "audit_log_target_name" NOT NULL,
	"action_type" "audit_log_action_type" NOT NULL,
	"old_value" jsonb,
	"new_value" jsonb,
	"create_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guild" (
	"id" text PRIMARY KEY NOT NULL,
	"locale" text DEFAULT 'ja' NOT NULL,
	"before_verify_level" integer,
	"create_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "public_setting"."auto_change_verify_level" (
	"guild_id" text PRIMARY KEY NOT NULL,
	"enabled" boolean NOT NULL,
	"start_hour" integer NOT NULL,
	"end_hour" integer NOT NULL,
	"level" integer NOT NULL,
	"enable_log" boolean NOT NULL,
	"log_channel" text,
	"create_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "public_setting"."auto_create_thread" (
	"guild_id" text PRIMARY KEY NOT NULL,
	"enabled" boolean NOT NULL,
	"channels" text[] NOT NULL,
	"create_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "public_setting"."auto_mod" (
	"guild_id" text PRIMARY KEY NOT NULL,
	"enabled" boolean NOT NULL,
	"enable_domain_filter" boolean NOT NULL,
	"enable_invite_url_filter" boolean NOT NULL,
	"enable_token_filter" boolean NOT NULL,
	"domain_list" text[] NOT NULL,
	"ignore_channels" text[] NOT NULL,
	"ignore_roles" text[] NOT NULL,
	"enable_log" boolean NOT NULL,
	"log_channel" text,
	"create_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "public_setting"."auto_public" (
	"guild_id" text PRIMARY KEY NOT NULL,
	"enabled" boolean NOT NULL,
	"channels" text[] NOT NULL,
	"create_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "public_setting"."ban_log" (
	"guild_id" text PRIMARY KEY NOT NULL,
	"enabled" boolean NOT NULL,
	"channel" text,
	"create_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "public_setting"."join_message" (
	"guild_id" text PRIMARY KEY NOT NULL,
	"enabled" boolean NOT NULL,
	"channel" text,
	"ignore_bot" boolean NOT NULL,
	"message" jsonb NOT NULL,
	"create_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "public_setting"."kick_log" (
	"guild_id" text PRIMARY KEY NOT NULL,
	"enabled" boolean NOT NULL,
	"channel" text,
	"create_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "public_setting"."leave_message" (
	"guild_id" text PRIMARY KEY NOT NULL,
	"enabled" boolean NOT NULL,
	"channel" text NOT NULL,
	"ignore_bot" boolean NOT NULL,
	"message" jsonb NOT NULL,
	"create_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "public_setting"."message_delete_log" (
	"guild_id" text PRIMARY KEY NOT NULL,
	"enabled" boolean NOT NULL,
	"channel" text,
	"create_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "public_setting"."message_edit_log" (
	"guild_id" text PRIMARY KEY NOT NULL,
	"enabled" boolean NOT NULL,
	"channel" text,
	"create_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "public_setting"."message_expand" (
	"guild_id" text PRIMARY KEY NOT NULL,
	"enabled" boolean NOT NULL,
	"allow_external_guild" boolean NOT NULL,
	"ignore_channels" text[] NOT NULL,
	"ignore_channel_types" text[] NOT NULL,
	"ignore_prefixes" text[] NOT NULL,
	"create_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "public_setting"."report" (
	"guild_id" text PRIMARY KEY NOT NULL,
	"channel" text,
	"include_moderator" boolean NOT NULL,
	"show_progress_button" boolean NOT NULL,
	"enable_mention" boolean NOT NULL,
	"mention_roles" text[] NOT NULL,
	"create_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "public_setting"."timeout_log" (
	"guild_id" text PRIMARY KEY NOT NULL,
	"enabled" boolean NOT NULL,
	"channel" text,
	"create_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "public_setting"."voice_log" (
	"guild_id" text PRIMARY KEY NOT NULL,
	"enabled" boolean NOT NULL,
	"channel" text,
	"create_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_guild_id_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "public"."guild"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "public_setting"."auto_change_verify_level" ADD CONSTRAINT "auto_change_verify_level_guild_id_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "public"."guild"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "public_setting"."auto_create_thread" ADD CONSTRAINT "auto_create_thread_guild_id_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "public"."guild"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "public_setting"."auto_mod" ADD CONSTRAINT "auto_mod_guild_id_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "public"."guild"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "public_setting"."auto_public" ADD CONSTRAINT "auto_public_guild_id_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "public"."guild"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "public_setting"."ban_log" ADD CONSTRAINT "ban_log_guild_id_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "public"."guild"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "public_setting"."join_message" ADD CONSTRAINT "join_message_guild_id_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "public"."guild"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "public_setting"."kick_log" ADD CONSTRAINT "kick_log_guild_id_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "public"."guild"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "public_setting"."leave_message" ADD CONSTRAINT "leave_message_guild_id_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "public"."guild"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "public_setting"."message_delete_log" ADD CONSTRAINT "message_delete_log_guild_id_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "public"."guild"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "public_setting"."message_edit_log" ADD CONSTRAINT "message_edit_log_guild_id_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "public"."guild"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "public_setting"."message_expand" ADD CONSTRAINT "message_expand_guild_id_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "public"."guild"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "public_setting"."report" ADD CONSTRAINT "report_guild_id_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "public"."guild"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "public_setting"."timeout_log" ADD CONSTRAINT "timeout_log_guild_id_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "public"."guild"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "public_setting"."voice_log" ADD CONSTRAINT "voice_log_guild_id_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "public"."guild"("id") ON DELETE cascade ON UPDATE no action;