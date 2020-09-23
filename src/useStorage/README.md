# useStorage

```ts
function useStorage(key: string, initialValue: Value, storage: Storage): StorageItem
```

Provides a convenient way to read and write items to the browser storage.

**Arguments**

- `key` is the key of the item in the storage.
- `initialValue` _(default: `null`)_ is the value to store in the item if it's missing.
- `storage` _(default: `window.localStorage`)_ the targeted browser storage. This can be `localStorage`, `sessionStorage` or any other object that implements similar interface.

**Returns** an array with two elements. The first element is the value of the storage item. The second is a function to set the item value.

# Usage

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
