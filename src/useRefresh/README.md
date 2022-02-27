# useRefresh

```tsx
function useRefresh(): RefreshFunction
// with
type RefreshFunction = () => void
```

Provides a simple way to force a component to rerender.

**Returns** a function `refresh` which when called will force the component to rerender.

_Note_ The effect of calling `refresh` is equivalent to updating a state in the component. The component is simply updated and is not unmounted and remounted again!

## Usage

```tsx
import React from 'react'
import {useRefresh} from 'react-tidy'

function App() {
  const refresh = useRefresh()
  return (
    <p>
      The time is {new Date()} <button onClick={refresh}>Refresh</button>
    </p>
  )
}
```
