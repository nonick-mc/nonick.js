import z from 'zod';
import { snowflakeRegex } from '@/lib/discord/constants';

export const snowflakeSchema = z.string().regex(snowflakeRegex, { message: '無効なIDです。' });
