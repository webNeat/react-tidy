# createAsync

```tsx
function createAsync(key: string, fn: AsyncFn, options: AsyncOptions): AsyncHook
```

Creates a React custom hook that can be used to run an asynchronous function and cache and share its results between multiple components at different levels.

**Arguments**

- `key` is a unique string to identify the async function.
- `fn` is an async function.
- `options` is an optional object that contains some or all of the configuration options below.

**Returns** a custom hook with the following signature:

```tsx
function useAsync(args, options: AsyncOptions): AsyncResult
```

- `args` are the arguments to pass to `fn`.
- `options` is an optional object that contains some or all of the following configuration options:
  - `autoRun`: if `true` then `fn` will be called with `args` once the hook is mounted. _(default: `true`)_
  - `rerunIfOlderThen`: a duration in milliseconds after which the cache should be ignored and the function should be called to give a new result. _(default: `30000` which is 30 seconds)_
  - `clearCacheIfUnusedFor`: a duration in milliseconds after which the result should be removed from the cache (to free the memory) if no component has been using it. _(default: `30000` which is 30 seconds)_

That hook returns an object with the following properties

- `hasResult` is `true` if a result of executing `fn` with the given arguments already exists.
- `isLoading` is `true` if `fn` has been called but didn't respond yet.
- `data` is the resolved value from the last call of `fn` with the given arguments. It's `undefined` if the last call threw an error or if no call has responded yet.
- `error` is the error thrown from the last call of `fn` with the given arguments. It's `undefined` if the last call didn't throw an error or if no call has responded yet.
- `run` can be used to run `fn` with the same arguments given to the hook and update all components using the same hook with the same arguments.

## Usage

```tsx
import React from 'react'
import {createAsync, useStorageItem} from 'react-tidy'

const useCurrentUser = createAsync('current-user', async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    return null
  }
  const res = await fetch(`/api/me`, {
    headers: {Authorization: `Bearer ${token}`},
  })
  return res.json()
})

const Navbar = () => {
  const res = useCurrentUser()
  if (res.isLoading) return <nav>Loading ...</nav>
  return <nav>Welcome {res.data ? res.data.name : 'Visitor'}</nav>
}

function Login() {
  const res = useCurrentUser()
  //...
  const onSubmit = () => {
    // after verifying the credentials and getting the token
    localStorage.setItem('token', token)
    res.run()
  }
  if (res.isLoading) return <div>Loading ...</div>
  if (res.data) return <div>You are already logged-in</div>
  return <form onSubmit={onSubmit}>{/*inputs and stuff*/}</form>
}

function App() {
  return (
    <>
      <Navbar />
      <Login />
    </>
  )
}
```

In this example `useCurrentUser` is a hook that can be used anywhere to get the current logged-in user. Even if two components are using it, only one request is sent thanks to the cache. When `res.run` is called, a new request is sent and all components using the hook are updated with the new result.
