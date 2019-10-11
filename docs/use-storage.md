---
title: useStorage
---

Get and set an item of a storage like `localStorage` and `sessionStorage`.

```typescript
function useStorage(
  key: string,
  defaultValue: any = null,
  storage: Storage = defaultStorage
)
```

## Parameters

`key`: The key of the item on the storage.

`defaultValue` __(optional)__: The value to return and set into the storage when no item with given key is found. (Default: `null`).

`storage` __(optional)__: The storage object to use. You can pass `window.localStorage`, `window.sessionStorage`, or any object implementing the [`Storage`](storage.md) interface. By default, a [memory storage](create-memory-storage.md) will be used.

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