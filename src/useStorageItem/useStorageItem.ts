import React from 'react'
import {useIsMounted} from '..'
import {Lazy, resolve} from '../internals'

export function useStorageItem<T>(key: string, initialValue: Lazy<T> = null, storage = window.localStorage) {
  const storedString = storage.getItem(key)
  if (storedString !== null) {
    initialValue = JSON.parse(storedString)
  }
  const [value, setValue] = React.useState<T | null>(initialValue)
  const isMounted = useIsMounted()
  React.useEffect(() => {
    if (storedString === null && initialValue !== null) {
      storage.setItem(key, JSON.stringify(initialValue))
    }
  }, [key, initialValue, storage])

  const setItem = React.useCallback(
    (x: Lazy<T>) => {
      const newValue = resolve(x)
      if (newValue === null) {
        storage.removeItem(key)
      } else {
        storage.setItem(key, JSON.stringify(newValue))
      }
      if (isMounted()) {
        setValue(newValue)
      }
    },
    [storage, key]
  )

  return [value, setItem] as [T | null, typeof setItem]
}
