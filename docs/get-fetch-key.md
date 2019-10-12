---
title: getFetchKey
---

Get the key used by [useFetch](use-fetch.md) to cache a particular request's result.

```typescript
function getFetchKey(
  url: string,
  options: FetchOptions
): string
```

`url`: the URL of the request.

`options`: the [fetch options](fetch-options.md).

