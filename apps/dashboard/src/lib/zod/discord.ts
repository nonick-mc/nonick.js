import z from 'zod';

export const snowflakeSchema = z.string().regex(/^\d{17,19}$/, { message: '無効なIDです。' });
