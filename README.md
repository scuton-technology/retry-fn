<div align="center">

# retry-fn

**Retry any async function with exponential backoff. Zero dependencies.**

[![npm](https://img.shields.io/npm/v/@scuton/retry-fn?style=flat-square)](https://www.npmjs.com/package/@scuton/retry-fn)
[![License: MIT](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=flat-square)](https://www.typescriptlang.org/)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen?style=flat-square)](package.json)

</div>

---

## Install

```bash
npm install @scuton/retry-fn
```

## Usage

```typescript
import { retry } from '@scuton/retry-fn';

// Simple
const data = await retry(() => fetch('/api/data'));

// With options
const data = await retry(() => fetch('/api/data'), {
  retries: 5,
  delay: 1000,
  backoff: 2,
  maxDelay: 10000,
  timeout: 5000,
  retryOn: (err) => err.message !== 'AUTH_FAILED',
  onRetry: (err, attempt) => console.log(`Attempt ${attempt} failed`),
});
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `retries` | `number` | `3` | Max retry count |
| `delay` | `number` | `1000` | Initial delay (ms) |
| `backoff` | `number` | `2` | Exponential factor |
| `maxDelay` | `number` | `30000` | Maximum delay cap (ms) |
| `timeout` | `number` | — | Per-attempt timeout (ms) |
| `retryOn` | `(error) => boolean` | — | Filter which errors to retry |
| `onRetry` | `(error, attempt) => void` | — | Callback on each retry |

## License

MIT — [Scuton Technology](https://scuton.com)
