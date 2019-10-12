---
title: useResponse
---

Make an HTTP request from a component and wait for the result before rendering that component. The component using this hook should be rendered inside a `React.Suspense` in order to properly render the fallback while waiting for the response.

```typescript
function useResponse<T>(
  url: string,
  options: RequestOptions,
  storage: Storage = getresponseStorage()
): {status: number, headers: Headers, body: T, reload: function}
```

## Parameters

`url`: the URL of the request.

`options`: the [request options](request-options.md).

`storage` _(optional)_: a [`Storage`](storage.md) where to cache the results. The default storage is [a memory storage](create-memory-storage.md) which you can get using [getResponseStorage](get-response-storage.md) and override using [setResponseStorage](set-response-storage.md).

__Note__: `useResponse` assumes that the response content is a valid JSON string and will throw an error if this is not the case.
