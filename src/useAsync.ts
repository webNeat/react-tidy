import { Storage, Fn } from './types'
import { useStorage } from './useStorage'
import { getAsyncStorage } from './storages'

export function useAsync<T>(
  key: string,
  fn: () => Promise<T>,
  storage: Storage = getAsyncStorage()
) {
  const [value, setValue] = useStorage<T>(key, null, storage)
  const reload = () => setValue(null)
  if (value === null) throw fn().then(setValue)
  return [value, reload] as [T, Fn<void>]
}
