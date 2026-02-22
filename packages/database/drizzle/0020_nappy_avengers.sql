CREATE TYPE "public"."verification_mode" AS ENUM('role', 'bypass_verification');--> statement-breakpoint
ALTER TABLE "public_setting"."verification" ADD COLUMN "mode" "verification_mode";--> statement-breakpoint
UPDATE "public_setting"."verification" SET "mode" = 'role' WHERE "mode" IS NULL;--> statement-breakpoint
ALTER TABLE "public_setting"."verification" ALTER COLUMN "mode" SET NOT NULL;
