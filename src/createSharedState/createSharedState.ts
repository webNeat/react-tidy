import React from 'react'
import {isFunction} from '../internals'

type Value<T> = T | ((x: T) => T)
type Subscriber<T> = (value: T) => void

export function createSharedState<T>(initialState: T) {
  let data = initialState
  const subscribers = new Set<Subscriber<T>>()
  const setValue = (value: Value<T>, notify = true) => {
    if (isFunction(value)) {
      value = (value as any)(data)
    }
    data = value as T
    if (notify) {
      subscribers.forEach((fn) => fn(data))
    }
  }

  return () => {
    const [state, setState] = React.useState(data)
    React.useEffect(() => {
      subscribers.add(setState)
      return () => {
        subscribers.delete(setState)
        if (subscribers.size === 0) {
          data = initialState
        }
      }
    }, [])
    return [state, setValue] as [T, (value: Value<T>, notify?: boolean) => void]
  }
}
