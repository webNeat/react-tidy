import { Storage, Fn } from 'types'
import { useStorage } from './useStorage'
import { createMemoryStorage } from './createMemoryStorage'

export function useAsync<T>(
  key: string,
  fn: () => Promise<T>,
  storage: Storage = useAsync.__storage
) {
  const [value, setValue] = useStorage<T>(key, null, storage)
  const reload = () => setValue(null)
  if (value === null) throw fn().then(setValue)
  return [value, reload] as [T, Fn<void>]
}

useAsync.__storage = createMemoryStorage()
