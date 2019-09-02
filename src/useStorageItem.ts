import { useState, useCallback } from 'react'

type StorageItem = {
  value: string | null
  set: (value: string) => void
  remove: () => void
}

export const useStorageItem = (
  name: string,
  storage: Storage = localStorage
): StorageItem => {
  const [value, setValue] = useState(storage.getItem(name))
  const set = useCallback(
    (x: string) => {
      storage.setItem(name, x)
      setValue(x)
    },
    [storage, name]
  )
  const remove = useCallback(() => {
    setValue(null)
    storage.removeItem(name)
  }, [storage, name])
  return { value, set, remove }
}
