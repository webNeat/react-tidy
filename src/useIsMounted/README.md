# useIsMounted

```ts
type Predicate = () => boolean
function useIsMounted(): Predicate
```

**Returns** a function that when called will return a boolean indicating whether this hook (and the component calling this hook) is mounted or not.

## Usage

Assume we have a component that loads some data when it's mounted:

```tsx
import React from 'react'

function MyComponent() {
  const [data, setData] = React.useState(null)
  React.useEffect(() => {
    fetchData().then((result) => {
      setData(result)
    })
  }, [])
  // ...
}
```

If this component is unmounted for some reason before the `fetchData()` resolves. Then, when it does, it will try to call `setData` of the unmounted state. This will cause the following React warning:

```
Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
```

The warning indicates that we should cancel the asynchronous task, but it's not always possible/easy to do so. That's where the `useIsMounted` hooks is useful:

```diff
import React from 'react'
+ import {useIsMounted} from 'react-tidy'

function MyComponent() {
  const [data, setData] = React.useState(null)
+  const isMounted = useIsMounted()
  React.useEffect(() => {
    fetchData().then((result) => {
+      if (isMounted()) {
        setData(result)
+      }
    })
  }, [])
  // ...
}
```

Now we will not call `setData` if the component has been unmounted.
