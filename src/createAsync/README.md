# createAsync

```tsx
function createAsync(fn: AsyncFn, cacheDuration = 60): AsyncHook
```

Creates a React custom hook that can be used to run an asynchronous function and cache and share its results between multiple components at different levels without a React Context. The returned hook should be called inside a `Suspense` child.

**Arguments**

- `fn` is an asynchronous function.
- `cacheDuration` is a duration in seconds during which the function results will be cached.

**Returns** a custom hook that takes the same arguments as `fn` and returns an array `[data, refresh]`:

- `data` is the returned value.
- `refresh` can be used to rerun `fn` with the same arguments given to the hook and refresh the cache.

if `fn` threw an exception, it will be thrown by the hook. So make sure `fn` will always resolve or add an [Error Boundary](https://reactjs.org/docs/error-boundaries.html)

## Usage

```tsx
import React from 'react'
import {createAsync, useStorageItem} from 'react-tidy'

const useCurrentUser = createAsync(async () => {
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
  const [user] = useCurrentUser(token)
  return <div>Welcome {user ? user.name : 'Visitor'}</div>
}

function Login() {
  const [user, refresh] = useCurrentUser()
  //...
  const onSubmit = () => {
    // after verifying the credentials and getting the token
    localStorage.setItem('token', token)
    refresh()
  }
  if (user) return <div>You are already logged-in</div>
  return <form onSubmit={onSubmit}>{/*inputs and stuff*/}</form>
}

function App() {
  return (
    <>
      <Suspense fallback={<div>Loading ...</div>}>
        <Navbar />
      </Suspense>
      <Suspense fallback={<div>Loading ...</div>}>
        <Login />
      </Suspense>
    </>
  )
}
```

In this example `useCurrentUser` is a hook that can be used anywhere to get the current logged-in user. Even if two components are using it, only one request is sent thanks to the cache. when `refresh` is called, a new request is sent and all components using the hook are updated with the new result.

## The story behind

A common thing I need to do is to load data from an API when my React component is mounted. A basic way to do that is:

```tsx
import React from 'react'

function MyComponent() {
  const [state, setState] = React.useState({isLoading: true, data: null, error: null})
  React.useEffect(() => {
    fetch('/some-url')
      .then((res) => res.json())
      .then((data) => setState({isLoading: false, data, error: null}))
      .catch((error) => setState({isLoading: false, data: null, error}))
  }, [])

  if (state.isLoading) return <p>Loading...</p>
  if (state.error) return <p>Ooops, error happend!</p>
  return <p>Show something using {state.data}</p>
}
```

But since I will do that in many components, I made a custom hook

```tsx
import React from 'react'

function useFetch(url) {
  const [state, setState] = React.useState({isLoading: true, data: null, error: null})
  React.useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => setState({isLoading: false, data, error: null}))
      .catch((error) => setState({isLoading: false, data: null, error}))
  }, [])
  return state
}

function MyComponent() {
  const state = useFetch('/some-url')

  if (state.isLoading) return <p>Loading...</p>
  if (state.error) return <p>Ooops, error happend!</p>
  return <p>Show something using {state.data}</p>
}
```

`useFetch` was good. But then I needed to do things like this

```tsx
function MyComponent() {
  const res1 = useFetch(`/some-url`)
  const res2 = useFetch(`/other-url/${res1.data.some_id}`)
  const res3 = useFetch(`/third-url/${res2.data.some_id}`)
  //...
}
```

That code didn't work because `res1.data` and `res2.data` are initially `null`. So I had to somehow wait for `res1.data` to be available before calling the next `useFetch`, something like

```tsx
function MyComponent() {
  const res1 = useFetch(`/some-url`)
  const res2 = res1.data ? useFetch(`/other-url/${res1.data.some_id}`) : null
  const res3 = res2 && res2.data ? useFetch(`/third-url/${res2.data.some_id}`) : null
  //...
}
```

But that code also failed because it breaks [the first rule of React hooks](https://reactjs.org/docs/hooks-overview.html#rules-of-hooks)

> Only call Hooks **at the top level**. Don’t call Hooks inside loops, conditions, or nested functions.

I wanted to solve this without touching the API, because it's not always possible to do so. My first idea was

**Split the code into multiple components**

```tsx
function MyComponent1() {
  const res1 = useFetch(`/some-url`)
  if (res1.isLoading) return <p>Loading ...</p>
  if (res1.error) return <p>Oooops, error happened!</p>
  return <MyComponent2 res1={res1} />
}

function MyComponent2({res1}) {
  const res2 = useFetch(`/other-url/${res1.data.some_id}`)
  if (res2.isLoading) return <p>Loading ...</p>
  if (res2.error) return <p>Oooops, error happened!</p>
  return <MyComponent3 res1={res1} res2={res2} />
}

function MyComponent3({res1, res2}) {
  const res3 = useFetch(`/third-url/${res2.data.some_id}`)
  if (res3.isLoading) return <p>Loading ...</p>
  if (res3.error) return <p>Oooops, error happened!</p>
  return (
    <p>
      Show something using {res1.data}, {res2.data} and {res3.data}
    </p>
  )
}
```

This works but is very verbose and does not scale well. React must be able to do better than that. If only I could stop the execution on the first `useFetch` until it gets its response before continuing with the rest. Actually I have `React.Suspense`, maybe if `useFetch` could throw a promise and only continue the execution when that promise is resolved ... And the `useAsync` idea was born.
