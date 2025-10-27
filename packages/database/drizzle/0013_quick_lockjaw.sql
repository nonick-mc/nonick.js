ALTER TABLE "audit_log" ALTER COLUMN "create_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "audit_log" ALTER COLUMN "create_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "guild" ALTER COLUMN "create_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "guild" ALTER COLUMN "create_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "guild" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "report" ALTER COLUMN "create_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "report" ALTER COLUMN "create_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "public_setting"."auto_change_verify_level" ALTER COLUMN "create_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "public_setting"."auto_change_verify_level" ALTER COLUMN "create_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "public_setting"."auto_change_verify_level" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "public_setting"."auto_create_thread" ALTER COLUMN "create_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "public_setting"."auto_create_thread" ALTER COLUMN "create_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "public_setting"."auto_create_thread" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "public_setting"."auto_mod" ALTER COLUMN "create_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "public_setting"."auto_mod" ALTER COLUMN "create_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "public_setting"."auto_mod" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "public_setting"."auto_public" ALTER COLUMN "create_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "public_setting"."auto_public" ALTER COLUMN "create_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "public_setting"."auto_public" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "public_setting"."ban_log" ALTER COLUMN "create_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "public_setting"."ban_log" ALTER COLUMN "create_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "public_setting"."ban_log" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "public_setting"."join_message" ALTER COLUMN "create_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "public_setting"."join_message" ALTER COLUMN "create_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "public_setting"."join_message" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "public_setting"."kick_log" ALTER COLUMN "create_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "public_setting"."kick_log" ALTER COLUMN "create_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "public_setting"."kick_log" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "public_setting"."leave_message" ALTER COLUMN "create_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "public_setting"."leave_message" ALTER COLUMN "create_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "public_setting"."leave_message" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "public_setting"."message_delete_log" ALTER COLUMN "create_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "public_setting"."message_delete_log" ALTER COLUMN "create_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "public_setting"."message_delete_log" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "public_setting"."message_edit_log" ALTER COLUMN "create_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "public_setting"."message_edit_log" ALTER COLUMN "create_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "public_setting"."message_edit_log" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "public_setting"."message_expand" ALTER COLUMN "create_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "public_setting"."message_expand" ALTER COLUMN "create_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "public_setting"."message_expand" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "public_setting"."report" ALTER COLUMN "create_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "public_setting"."report" ALTER COLUMN "create_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "public_setting"."report" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "public_setting"."timeout_log" ALTER COLUMN "create_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "public_setting"."timeout_log" ALTER COLUMN "create_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "public_setting"."timeout_log" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "public_setting"."verification" ALTER COLUMN "create_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "public_setting"."verification" ALTER COLUMN "create_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "public_setting"."verification" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "public_setting"."voice_log" ALTER COLUMN "create_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "public_setting"."voice_log" ALTER COLUMN "create_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "public_setting"."voice_log" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;