# createSharedState

```ts
function createSharedState(valueOrFn): SharedStateHook
```

Creates a React custom hook that can be used to share state between multiple components at different levels without a React Context.

**Arguments**

- `valueOrFn` is the initial value (or a function that returns the value) of the shared state. If this is a function, it will be called when the hook is first used by some component.

**Returns** a custom hook similar to `React.useState` but doesn't take any argument. This hook can be used in multiple components at different levels of the React tree. When one component changes the value, the change is reflected on all other components using the same hook.

# Usage

```tsx
import React from 'react'
import {createSharedState} from 'react-tidy'

const useCounter = createSharedState(0)

function CounterValue() {
  const [value] = useCounter()
  return <p>{value}</p>
}

function IncrementButton() {
  const [, setValue] = useCounter()
  return <button onClick={() => setValue((x) => x + 1)}>+</button>
}

function DecrementButton() {
  const [, setValue] = useCounter()
  return <button onClick={() => setValue((x) => x - 1)}>-</button>
}

function App() {
  return (
    <>
      <CounterValue />
      <IncrementButton />
      <DecrementButton />
    </>
  )
}
```
