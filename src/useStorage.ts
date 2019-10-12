import React from 'react'
import { isFunction } from './utils'
import { Storage, Fn } from './types'
import { getDefaultStorage } from './storages'

type Value<T> = T | Fn<T> | null

export function useStorage<T>(
  key: string,
  initialValue: Value<T> = null,
  storage: Storage = getDefaultStorage()
): [T | null, (x: Value<T>) => void] {
  let storedString = storage.getItem(key)
  const [value, setValue] = React.useState<T | null>(
    storedString ? (JSON.parse(storedString) as T) : initialValue
  )
  React.useEffect(() => {
    if (!storedString && initialValue) {
      storage.setItem(key, JSON.stringify(initialValue))
    }
  }, [key, initialValue])
  const set = React.useCallback(
    (newValue: Value<T>) => {
      if (newValue === null) {
        storage.removeItem(key)
        setValue(null)
      } else {
        if (isFunction(newValue)) {
          newValue = (newValue as Fn<T>)()
        }
        storage.setItem(key, JSON.stringify(newValue))
        setValue(newValue)
      }
    },
    [storage, key]
  )
  return [value, set]
}
