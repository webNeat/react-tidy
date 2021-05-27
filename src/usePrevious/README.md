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

function random() {
  return Math.floor(100 * Math.random())
}

function RandomNumbers() {
  const [value, setValue] = React.useState(random())
  const lastThreeValues = usePrevious(value, 3)

  return (
    <div>
      <p>
        Random integer between 0 and 100: <strong>{value}</strong>
      </p>
      <button onClick={() => setValue(random())}>Generate</button>
      <p>Last 3 different values:</p>
      {lastThreeValues.map((x, i) => (
        <p key={i}>{x}</p>
      ))}
    </div>
  )
}
```
