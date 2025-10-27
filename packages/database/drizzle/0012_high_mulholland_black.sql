ALTER TABLE "audit_log" RENAME COLUMN "old_value" TO "before";--> statement-breakpoint
ALTER TABLE "audit_log" RENAME COLUMN "new_value" TO "after";