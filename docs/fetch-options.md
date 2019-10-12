---
title: FetchOptions
---

```typescript
type FetchOptions = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers: {[key: string]: string}
  body: string | URLSearchParams | FormData | Blob | ArrayBuffer | DataView
  credentials: 'omit' | 'same-origin' | 'include'
}
```