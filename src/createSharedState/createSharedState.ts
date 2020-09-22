import React from 'react'
import {useRefresh} from '../useRefresh/useRefresh'
import {isFunction, Lazy, resolve, Store} from '../internals'

type Value<T> = T | ((x: T) => T)

export function createSharedState<T>(initialValueOrFn: Lazy<T>) {
  let store: Store<T>

  return () => {
    if (!store) {
      store = new Store(resolve(initialValueOrFn))
    }
    const refresh = useRefresh()
    React.useEffect(() => {
      store.addListener(refresh)
      return () => {
        store.removeListener(refresh)
        if (!store.hasListeners()) {
          store = null as any
        }
      }
    }, [])
    const setValue = (value: Value<T>) => {
      store.set(isFunction(value) ? (value as any)(store.get()) : value)
    }
    return [store.get(), setValue] as [T, typeof setValue]
  }
}
