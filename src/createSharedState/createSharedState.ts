import React from 'react'
import {getStore} from '../store'
import {isFunction} from '../internals'
import {useRefresh} from '../useRefresh/useRefresh'

type Value<T> = T | ((x: T) => T)

export function createSharedState<T>(key: string, initialState: T) {
  key = 'state:' + key
  const store = getStore()
  if (store.get(key) === undefined) {
    store.set(key, initialState)
  }
  return () => {
    const refresh = useRefresh()
    React.useEffect(() => {
      store.addListener(key, refresh)
      return () => store.removeListener(key, refresh)
    }, [])
    const setValue = (value: Value<T>) => {
      store.set(key, isFunction(value) ? (value as any)(store.get(key)) : value)
    }
    return [store.get(key), setValue] as [T, typeof setValue]
  }
}
