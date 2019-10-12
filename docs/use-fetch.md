---
title: useFetch
---

Make an HTTP request from a component and wait for the result before rendering that component. The component using this hook should be rendered inside a `React.Suspense` in order to properly render the fallback while waiting for the response.

```typescript
function useFetch<T>(
  url: string,
  options: FetchOptions,
  storage: Storage = getFetchStorage()
): {status: number, headers: Headers, body: T, reload: function}
```

## Parameters

`url`: the URL of the request.

`options`: the [fetch options](fetch-options.md).

`storage` _(optional)_: a [`Storage`](storage.md) where to cache the results. The default storage is [a memory storage](create-memory-storage.md) which you can get using [getFetchStorage](get-fetch-storage.md) and override using [setFetchStorage](set-fetch-storage.md).

__Note__: `useFetch` assumes that the response content is a json string and will throw an error if this is not the case.
