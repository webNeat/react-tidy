import { Storage, FetchOptions } from './types'
import { useAsync } from 'useAsync'
import { getFetchStorage } from 'storages'

export function useFetch<T>(
  url: string,
  options: FetchOptions,
  storage: Storage = getFetchStorage()
) {
  const key = getFetchKey(url, options)
  const fn = () => request<T>(url, options)
  const [result, reload] = useAsync(key, fn, storage)
  return { ...result, reload }
}

export const getFetchKey = (url: string, options: FetchOptions) => {
  return JSON.stringify({ url, options })
}

async function request<T>(url: string, options: FetchOptions) {
  const res = await fetch(url, options)
  const body = (await res.json()) as T
  return {
    status: res.status,
    headers: res.headers,
    body,
  }
}
