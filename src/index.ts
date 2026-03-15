export interface RetryOptions {
  retries?: number;
  delay?: number;
  backoff?: number;
  maxDelay?: number;
  timeout?: number;
  retryOn?: (error: Error) => boolean;
  onRetry?: (error: Error, attempt: number) => void;
}

export async function retry<T>(
  fn: () => Promise<T>,
  options?: RetryOptions
): Promise<T> {
  const {
    retries = 3,
    delay = 1000,
    backoff = 2,
    maxDelay = 30000,
    timeout,
    retryOn,
    onRetry,
  } = options ?? {};

  let lastError: Error;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      if (timeout) {
        return await Promise.race([
          fn(),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), timeout)
          ),
        ]);
      }
      return await fn();
    } catch (err: any) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt === retries) break;
      if (retryOn && !retryOn(lastError)) break;
      if (onRetry) onRetry(lastError, attempt + 1);
      const waitTime = Math.min(delay * Math.pow(backoff, attempt), maxDelay);
      await new Promise((r) => setTimeout(r, waitTime));
    }
  }

  throw lastError!;
}
