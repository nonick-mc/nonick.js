import { z } from 'zod';

export type FormInputSchema = z.input<typeof captchaFormSchema>;
export type FormOutputSchema = z.input<typeof captchaFormSchema>;

export const captchaFormSchema = z.object({
  turnstileToken: z.string(),
});
