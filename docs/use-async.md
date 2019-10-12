---
title: useAsync
---

Makes it possible to call an asynchronous function from a component and wait for the result before rendering that component. The component using this hook should be rendered inside a `React.Suspense` in order to properly render the fallback while waiting for the async function.

```typescript
function useAsync<T>(
  key: string,
  fn: () => Promise<T>,
  storage: Storage = defaultAsyncStorage
): [T, function]
```

## Parameters

`key`: A string key used to store the result of the function into a cache. This has to be unique per storage.

`fn`: The asynchronous function.

`storage` _(optional)_: a [`Storage`](storage.md) where to store the result of the function. The default storage is [a memory storage](create-memory-storage.md) which you can get using [getAsyncStorage](get-async-storage.md) and override using [setAsyncStorage](set-async-storage.md).

## Usage

```jsx
import React, {Suspense} from 'react'
import {useAsync} from 'react-tidy'

// async function that loads some data
const fetchTodos = () => fetch('/api/todos').then(res => res.json())

const Todos = () => {
  const [todos, reload] = useAsync('todos', fetchTodos)
  return (
    <>
      <button onClick={reload}>Reload Todos</button>
      {todos.map(x =>
        <p key={x.id}>{x.content}</p>
      )}
    </>
  )
}

const App = () => (
  <Suspense fallback={<p>Loading...</p>}>
    <Todos/>
  </Suspense>
)
```
