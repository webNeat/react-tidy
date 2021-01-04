# usePrevious

```ts
function usePrevious(state: T, count: number = 1): T[]
```

**Arguments**

- `state` the variable to record previous values of.
- `count` _(default: `1`)_ The maximum number of previous values to record.

**Returns** an array of the previous values of `state` sorted from recent to oldest.

# Usage

```tsx
import React from 'react'
import {usePrevious} from 'react-tidy'

function Search() {
  const queryRef = React.useRef()
  const [query, setQuery] = React.useState('')
  const lastThreeQueries = usePrevious(query, 3)

  return (
    <div>
      <input ref={queryRef} type="text" />
      <button onClick={() => setQuery(queryRef.current.value)}>Search</button>
      <br />
      <ul>
        {lastThreeQueries.map((previousQuery) => (
          <li>{previousQuery}</li>
        ))}
      </ul>
    </div>
  )
}
```
