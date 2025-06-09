/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'audit_log'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- Replace <constraint_name> with the actual primary key constraint name
ALTER TABLE "audit_log" DROP CONSTRAINT "audit_log_pkey";
ALTER TABLE "audit_log" ALTER COLUMN "guild_id" DROP NOT NULL;
