import z from 'zod';

export const formSchema = z.object({
  turnstileToken: z.string(),
});
