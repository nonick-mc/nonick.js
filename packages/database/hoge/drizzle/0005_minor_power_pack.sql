ALTER TABLE "public_setting"."message_expand" ALTER COLUMN "ignore_channel_types" SET DATA TYPE integer[] USING ignore_channel_types::integer[];
