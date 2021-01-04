# useInstance

```ts
function useInstance(Class: ClassType, ...args: ConstructorArgs): InstanceType
```

Creates an instance of `Class` that rerenders the hook whenever one of its attributes changes.

**Arguments**

- `Class` is any class.
- `args` are the argument to pass to the constructor (`new Class(...args)`).

**Returns** an instance of `Class`.

## Simple usage

```tsx
import React from 'react'

class Counter {
  public value: number
  constructor(value = 0) {
    this.value = value
  }
  increment() {
    this.value++
  }
  decrement() {
    this.value--
  }
}

function CountDown() {
  const counter = useInstance(Counter, 10)
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (counter.value > 0) {
        counter.decrement()
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return <div>{counter.value}</div>
}
```
