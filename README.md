<div align="center">
  <br>
  <h1>retry-fn</h1>
  <p><strong>Retry any async function with exponential backoff</strong></p>
  <br>
  <p>
    <a href="https://www.npmjs.com/package/@scuton/retry-fn"><img src="https://img.shields.io/npm/v/@scuton/retry-fn?color=2563eb&label=npm" alt="npm"></a>
    <a href="https://www.npmjs.com/package/@scuton/retry-fn"><img src="https://img.shields.io/npm/dm/@scuton/retry-fn?color=gray&label=downloads" alt="downloads"></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="license"></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/types-TypeScript-3178c6" alt="typescript"></a>
  </p>
  <br>
</div>

> Retry any async function with exponential backoff. One function, zero dependencies.

## Highlights

- ✅ Exponential backoff — configurable delay, factor, and max delay
- ✅ Per-attempt timeout — abort slow attempts individually
- ✅ Retry filter — only retry specific errors with `retryOn`
- ✅ Retry callback — get notified on each retry with `onRetry`
- ✅ Fully typed — returns the same type as your function
- ✅ Zero dependencies

## Install

```sh
npm install @scuton/retry-fn
```

## Usage

```typescript
import { retry } from '@scuton/retry-fn';

// Simple — retry a fetch call up to 3 times
const response = await retry(() =>
  fetch('https://api.example.com/users')
);

// With options — retry a database connection
const db = await retry(
  () => connectToDatabase('postgres://localhost:5432/mydb'),
  {
    retries: 5,
    delay: 2000,
    backoff: 2,
    maxDelay: 30000,
    onRetry: (error, attempt) => {
      console.log(`Connection attempt ${attempt} failed: ${error.message}`);
    },
  }
);

// With timeout — abort if a single attempt takes too long
const data = await retry(() => fetchSlowAPI(), {
  retries: 3,
  timeout: 5000, // 5s per attempt
});

// With retryOn — only retry on network errors
const result = await retry(() => callExternalService(), {
  retries: 3,
  retryOn: (error) => error.message.includes('ECONNRESET'),
});
```

## API

### retry(fn, options?)

Retry an async function until it succeeds or the retry limit is reached.

Returns: `Promise<T>` — the return value of `fn`

Throws: The last error if all attempts fail.

#### fn

Type: `() => Promise<T>`

The async function to retry.

#### options

Type: `object`

##### options.retries

Type: `number`\
Default: `3`

Maximum number of retries. The function is called `retries + 1` times total.

##### options.delay

Type: `number`\
Default: `1000`

Initial delay between retries in milliseconds.

##### options.backoff

Type: `number`\
Default: `2`

Exponential backoff factor. Delay is multiplied by this on each retry.

Example with `delay: 1000` and `backoff: 2`: 1s → 2s → 4s → 8s

##### options.maxDelay

Type: `number`\
Default: `30000`

Maximum delay cap in milliseconds. Prevents backoff from growing indefinitely.

##### options.timeout

Type: `number`

Per-attempt timeout in milliseconds. If a single attempt exceeds this, it's aborted with a `Timeout` error and the next attempt begins.

##### options.retryOn

Type: `(error: Error) => boolean`

A function that determines whether to retry on a given error. Return `false` to stop retrying immediately.

```typescript
// Only retry on network errors
retryOn: (error) => error.code === 'ECONNRESET'
```

##### options.onRetry

Type: `(error: Error, attempt: number) => void`

Called after each failed attempt, before the delay. Useful for logging.

```typescript
onRetry: (error, attempt) => {
  console.log(`Attempt ${attempt} failed: ${error.message}`);
}
```

## FAQ

### Why not p-retry?

`p-retry` is great but pulls in `is-network-error` and `retry` as dependencies. `@scuton/retry-fn` gives you the same core functionality in a single file with zero dependencies.

### What happens if all retries fail?

The last error is thrown, so you can catch it normally.

### Does it support AbortController?

Not yet — but you can use `retryOn` to stop retrying based on any condition.

## Related

- [@scuton/safe-json](https://github.com/scuton-technology/safe-json) — JSON.parse that never throws
- [@scuton/port-finder](https://github.com/scuton-technology/port-finder) — Find an available port

## License

MIT © [Scuton Technology](https://scuton.com)
