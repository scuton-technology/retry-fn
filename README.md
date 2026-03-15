# @scuton/retry-fn

Retry any async function with exponential backoff. Zero dependencies. TypeScript first.

## Install

```bash
npm install @scuton/retry-fn
```

## Usage

```typescript
import { retry } from '@scuton/retry-fn';

const data = await retry(() => fetch('https://api.example.com/data'), {
  retries: 3,
  delay: 1000,
  backoff: 2,
  maxDelay: 10000,
  onRetry: (err, attempt) => console.log(`Attempt ${attempt} failed`),
});
```

## API

### `retry<T>(fn: () => Promise<T>, options?: RetryOptions): Promise<T>`

Options:
- `retries` — max retry count (default: 3)
- `delay` — initial delay in ms (default: 1000)
- `backoff` — exponential factor (default: 2)
- `maxDelay` — maximum delay cap in ms (default: 30000)
- `timeout` — per-attempt timeout in ms
- `retryOn` — filter function: `(error) => boolean`
- `onRetry` — callback: `(error, attempt) => void`

## License

MIT © Scuton Technology
