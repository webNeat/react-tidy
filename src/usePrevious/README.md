# usePrevious

```ts
function usePrevious(state: T, count: number = 1): T[]
```

**Arguments**

- `state` the variable to record previous values of.
- `count` _(default: `1`)_ The maximum number of previous values to record.

**Returns** an array of the previous values of `state` sorted from recent to oldest.
