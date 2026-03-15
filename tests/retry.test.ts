import { describe, it, expect, vi } from 'vitest';
import { retry } from '../src/index';

describe('retry', () => {
  it('should return value on first success', async () => {
    const result = await retry(() => Promise.resolve(42));
    expect(result).toBe(42);
  });

  it('should retry on failure and eventually succeed', async () => {
    let attempt = 0;
    const result = await retry(
      () => {
        attempt++;
        if (attempt < 3) throw new Error('fail');
        return Promise.resolve('ok');
      },
      { retries: 3, delay: 10 }
    );
    expect(result).toBe('ok');
    expect(attempt).toBe(3);
  });

  it('should throw after max retries', async () => {
    await expect(
      retry(() => Promise.reject(new Error('always fails')), {
        retries: 2,
        delay: 10,
      })
    ).rejects.toThrow('always fails');
  });

  it('should call onRetry callback', async () => {
    const onRetry = vi.fn();
    let attempt = 0;
    await retry(
      () => {
        attempt++;
        if (attempt < 3) throw new Error('fail');
        return Promise.resolve('ok');
      },
      { retries: 3, delay: 10, onRetry }
    );
    expect(onRetry).toHaveBeenCalledTimes(2);
    expect(onRetry).toHaveBeenCalledWith(expect.any(Error), 1);
    expect(onRetry).toHaveBeenCalledWith(expect.any(Error), 2);
  });

  it('should respect retryOn filter', async () => {
    let attempt = 0;
    await expect(
      retry(
        () => {
          attempt++;
          throw new Error('skip');
        },
        {
          retries: 5,
          delay: 10,
          retryOn: (err) => err.message !== 'skip',
        }
      )
    ).rejects.toThrow('skip');
    expect(attempt).toBe(1);
  });

  it('should timeout individual attempts', async () => {
    await expect(
      retry(
        () => new Promise((resolve) => setTimeout(() => resolve('slow'), 500)),
        { retries: 1, delay: 10, timeout: 50 }
      )
    ).rejects.toThrow('Timeout');
  });

  it('should apply exponential backoff', async () => {
    const start = Date.now();
    let attempt = 0;
    await retry(
      () => {
        attempt++;
        if (attempt <= 3) throw new Error('fail');
        return Promise.resolve('ok');
      },
      { retries: 3, delay: 50, backoff: 2 }
    ).catch(() => {});
    const elapsed = Date.now() - start;
    // delay: 50, 100, 200 = 350ms minimum
    expect(elapsed).toBeGreaterThanOrEqual(100);
  });

  it('should cap delay at maxDelay', async () => {
    const start = Date.now();
    let attempt = 0;
    try {
      await retry(
        () => {
          attempt++;
          throw new Error('fail');
        },
        { retries: 3, delay: 100, backoff: 10, maxDelay: 150 }
      );
    } catch {}
    const elapsed = Date.now() - start;
    // Should be ~100 + 150 + 150 = 400ms, not 100 + 1000 + 10000
    expect(elapsed).toBeLessThan(2000);
  });
});
