# useStorage

```ts
function useStorage(key: string, defaultValue: Value, storage: LazyStorage): StorageItem
type LazyStorage = Storage | (() => Storage)
```

Provides a convenient way to read and write items to the browser storage.

**Arguments**

- `key` is the key of the item in the storage.
- `defaultValue` _(default: `null`)_ is the value to store in the item if it's missing.
- `storage` _(default: `window.localStorage` in the browser and a [memory storage on the server](#using-with-server-side-rendering))_ the targeted browser storage. This can be `localStorage`, `sessionStorage` or any other object that implements the web storage interface.

**Returns** an array with two elements. The first element is the value of the storage item. The second is a function to set the item value.

# Simple Usage

```tsx
import React from 'react'
import {useStorage} from 'react-tidy'

function MyComponent() {
  const [token, setToken] = useStorage('token')
  // ...
}
```

This example reads the item `token` from `localStorage`, if no such item exists then the value of `token` will be `null`.

Calling `setToken(value)` will run `localStorage.setItem('token', value)` and change it on the component.

Calling `setToken(null)` will run `localStorge.removeItem('token')` and set it to `null` in the component.

# Setting the default storage

You can set the default storage to be used when the `storage` parameter is not provided in the call.

```tsx
import {setDefaultStorage} from 'react-tidy'

setDefaultStorage(window.sessionStorage)
// or
setDefaultStorage(() => {
  if (someCondition) {
    return window.sessionStorage
  } else {
    return window.localStorage
  }
}
```

# Using with server side rendering

If you want to server side render your application, then you may not be able to access the `window` object. In that case, the following line will fail:

```tsx
const [token, setToken] = useStorage('userId', 0, window.localStorage)
```

The solution to this is to simply provide a callback that returns the storage:

```tsx
const [token, setToken] = useStorage('userId', 0, () => window.localStorage)
```

The `useStorage` hook will not evaluate the callback if not running in a browser environment. It will use a memory storage instead.
So the line above will always return a value of `0` on the server.
