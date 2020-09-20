# createSharedState

```ts
function createSharedState(key: string, initialState): SharedStateHook
```

Creates a React custom hook that can be used to share state between multiple components at different levels without a React Context.

**Arguments**

- `key` a unique string to identify the shared state.
- `initialValue` is the initial value of the shared state.

**Returns** a custom hook similar to `React.useState` but doesn't take any argument. This hook can be used in multiple components at different levels of the React tree. When one component changes the value, the change is reflected on all other components using the same hook.

# Usage

```tsx
import React from 'react'
import {createSharedState} from 'react-tidy'

const useCurrentUser = createSharedState('current-user', null)

function Navbar() {
  const [user] = useCurrentUser()
  return <p>Welcome {user ? user.name : 'Visitor'}</p>
}

function Login() {
  const [, setUser] = useCurrentUser()
  return <button onClick={() => setUser({name: 'Amine'})}>Login</button>
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

In the example above, when the "Login" button is clicked, the current user will be set to `{name: 'Amine'}` and the Navbar will rerender and show "Welcome Amine".
