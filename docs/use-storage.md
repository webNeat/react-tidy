---
title: useStorage
---

Read/write an item from/into a storage like `localStorage` and `sessionStorage`.

```typescript
function useStorage<T>(
  key: string,
  defaultValue: T | null = null,
  storage: Storage = getDefaultStorage()
): [T, function]
```

## Parameters

`key`: The key of the item on the storage.

`defaultValue` _(optional)_: The value to return and set into the storage when no item with given key is found. (Default: `null`).

`storage` _(optional)_: The storage object to use. It can be `window.localStorage`, `window.sessionStorage`, or any object implementing the [`Storage`](storage.md) interface. The default storage is [a memory storage](create-memory-storage.md) which you can get using [getDefaultStorage](get-default-storage.md) and override using [setDefaultStorage](set-default-storage.md).

## Usage

```typescript
import {useStorage} from 'react-tidy'
```

Then inside a React functional component:

```typescript
const [token, setToken] = useStorage('auth-token', 'default', window.localStorage)
```

`token` will contain the value stored in localStorage for the key `auth-token`.
if no item with that key is found, then `default` will be stored in localStorage.

```typescript
setToken('foo') // stores the value on localStorage and sets token to 'foo'
setToken(null) // removes the item from localStorage and sets token to `null`
```

The value can be anything, not just a string.

```typescript
const [state, setState] = useStorage('state', {isLoading: true})
//...
setState({isLoading: false, data: {...}})
```

`JSON.stringify` and `JSON.parse` are used to serialize/unserialize the value.

You can also give a function as value similar to `React.useState`.

```typescript
const [lazyState, setLazyState] = useStorage('lazy-state', () => {
  // do some computation ...
  return data
})
//...
setLazyState(currentState => {
  // ...
  return newState
})
```