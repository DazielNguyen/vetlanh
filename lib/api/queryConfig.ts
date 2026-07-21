export const STALE = {
  SHORT: 5 * 60 * 1000,
  LONG: 10 * 60 * 1000,
  DAILY: 24 * 60 * 60 * 1000,
} as const;

export const skipRetryOn =
  (...codes: number[]) =>
  (failureCount: number, error: unknown): boolean => {
    // core.ts interceptor normalizes all Axios errors into a flat ApiError { code, message }
    // so .response?.status is always undefined. Read .code directly.
    const code = (error as { code?: number })?.code;
    if (code !== undefined && codes.includes(code)) return false;
    return failureCount < 2;
  };
