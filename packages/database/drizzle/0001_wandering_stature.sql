ALTER TABLE "audit_log" DROP CONSTRAINT "audit_log_guild_id_guild_id_fk";
--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_guild_id_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "public"."guild"("id") ON DELETE cascade ON UPDATE no action;