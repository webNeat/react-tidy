import React, {useMemo} from 'react'
import {isFunction, isInBrowser} from '../utils'
import {getDefaultStorage} from './defaultStorage'
import {createMemoryStorage} from './createMemoryStorage'
import {useIsMounted} from '../useIsMounted/useIsMounted'

type Value<T> = T | null | ((x: T | null) => T | null)

export function useStorage<T>(key: string, defaultValue: T | null = null, getStorage = getDefaultStorage()) {
  const isMounted = useIsMounted()
  const storage = useMemo<Storage>(() => {
    if (!isInBrowser()) return createMemoryStorage()
    if (isFunction(getStorage)) return (getStorage as any)()
    return getStorage
  }, [getStorage])
  const initialValue = useMemo(() => {
    const storedString = storage.getItem(key)
    return storedString === null ? defaultValue : JSON.parse(storedString)
  }, [storage, key, defaultValue])

  const [value, setValue] = React.useState<T | null>(initialValue)

  React.useEffect(() => {
    storage.setItem(key, JSON.stringify(initialValue))
  }, [key, initialValue])

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
