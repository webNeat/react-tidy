import React, {useMemo} from 'react'
import {useIsMounted} from '..'
import {isFunction, isInBrowser} from '../utils'
import {getDefaultStorage} from './defaultStorage'
import {createMemoryStorage} from './createMemoryStorage'

type Value<T> = T | null | ((x: T | null) => T | null)

export function useStorage<T>(key: string, defaultValue: T | null = null, getStorage = getDefaultStorage()) {
  const storage = useMemo<Storage>(() => {
    if (!isInBrowser()) return createMemoryStorage()
    if (isFunction(getStorage)) return (getStorage as any)()
    return getStorage
  }, [getStorage])
  const storedString = storage.getItem(key)
  if (storedString !== null) {
    defaultValue = JSON.parse(storedString)
  }
  const [value, setValue] = React.useState<T | null>(defaultValue)
  const isMounted = useIsMounted()
  React.useEffect(() => {
    if (storedString === null && defaultValue !== null) {
      storage.setItem(key, JSON.stringify(defaultValue))
    }
  }, [key, defaultValue, storage])

  const setItem = React.useCallback(
    (newValue: Value<T>) => {
      if (isFunction(newValue)) {
        newValue = (newValue as any)(value)
      }
      if (newValue === null) {
        storage.removeItem(key)
      } else {
        storage.setItem(key, JSON.stringify(newValue))
      }
      if (isMounted()) {
        setValue(newValue)
      }
    },
    [storage, key, value]
  )

  return [value, setItem] as [T | null, typeof setItem]
}
