# React Tidy

[![Build Status](https://travis-ci.org/webNeat/react-tidy.svg?branch=master)](https://travis-ci.org/webNeat/react-tidy)
[![Coverage Status](https://coveralls.io/repos/github/webNeat/react-tidy/badge.svg?branch=master)](https://coveralls.io/github/webNeat/react-tidy?branch=master)

A collection of handy, flexible, tested and documented React custom hooks.

**This library is still under construction. The API will change many time!**

## Installation
```
npm i react-tidy
```

## Contents
  ### Custom Hooks
  - [useStorage](#usestorage)
  ### Functions
  - [createMemoryStorage](#creatememorystorage)
  ### Interfaces
  - [Storage](#storage)

## Custom Hooks

### useStorage
Get and set an item of a storage like `localStorage` and `sessionStorage`.

```ts
function useStorage(
  key: string,
  defaultValue: any = null,
  storage: Storage = defaultStorage
)
```

#### Parameters
- **key**: The key of the item on the storage.
- **defaultValue**(optional): The value to return and set into the storage when no item with given key is found. (Default: `null`).
- **storage**(optional): The storage object to use. You can pass `window.localStorage`, `window.sessionStorage`, or any object implementing the [`Storage`](#storage) interface. By default, a [memory storage](#creatememorystorage) will be used.

#### Usage
```tsx
import {useStorage} from 'react-tidy'
```
Then inside a React functional component:
```ts
const [token, setToken] = useStorage('auth-token', 'default', window.localStorage)
```
`token` will contain the value stored in localStorage for the key `auth-token`.
if no item with that key is found, then `default` will be stored in localStorage.
```ts
setToken('foo') // stores the value on localStorage and sets token to 'foo'
setToken(null) // removes the item from localStorage and sets token to `null`
```

The value can be anything, not just a string.
```ts
const [state, setState] = useStorage('state', {isLoading: true})
//...
setState({isLoading: false, data: {...}})
```
`JSON.stringify` and `JSON.parse` are used to serialize/unserialize the value.

You can also give a function as value similar to `React.useState`.
```ts
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

## Functions

### createMemoryStorage
Creates a storage object that stores data in memory and implements the [Storage](#storage) interface. Similar to `window.sessionStorage` but the data is lost once the page is closed or reloaded.

#### Usage
```ts
import {createMemoryStorage} from 'react-tidy'

const memoryStorage = createMemoryStorage()

// set a new item
memoryStorage.setItem('key', 'value')

// get an item
const value = memoryStorage.getItem('key') // returns `null` if missing

// remove an item
memoryStorage.removeItem('key')

// remove all items
memoryStorage.clear()
```

## Interfaces

### Storage
A simple version of the [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Storage) interface. You can implement it to create your own storage objects.
```ts
interface Storage {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
  clear: () => void
}
```
