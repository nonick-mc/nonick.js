type TurnstileErrorCodes =
  | 'missing-input-secret'
  | 'invalid-input-secret'
  | 'missing-input-response'
  | 'invalid-input-response'
  | 'bad-request'
  | 'timeout-or-duplicate'
  | 'internal-error';

type TurnstileResult =
  | {
      success: false;
      'error-codes': TurnstileErrorCodes[];
      messages: [];
    }
  | {
      success: true;
      'error-codes': [];
      challenge_ts: string;
      hostname: string;
      action: string;
      cdata: string;
      idempotency_key?: string;
      metadata?: {
        interaction?: boolean;
      };
    };

/**
 * Cloudflare Turnstileのトークンを検証
 * @param token トークン
 * @returns
 */
export const verifyTurnstileToken = async (token: string): Promise<void> => {
  if (!token) throw new Error('Not Completed Verification');

  const formData = new FormData();
  formData.append('secret', process.env.TURNSTILE_SECRETKEY);
  formData.append('response', token);

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: formData,
  });

  const { success }: TurnstileResult = await res.json();
  if (!success) throw new Error('Invalid Token');
};
