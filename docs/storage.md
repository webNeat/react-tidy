---
title: Storage
---

A simple version of the [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Storage) interface. You can implement it to create your own storage objects.

```ts
interface Storage {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
  clear: () => void
}
```