export const STALE = {
  SHORT: 5 * 60 * 1000,
  LONG: 10 * 60 * 1000,
} as const;

export const skipRetryOn =
  (...codes: number[]) =>
  (failureCount: number, error: unknown): boolean => {
    const status = (error as { response?: { status?: number } })?.response?.status;
    if (status !== undefined && codes.includes(status)) return false;
    return failureCount < 2;
  };
