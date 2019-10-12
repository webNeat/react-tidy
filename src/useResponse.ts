import { Storage, RequestOptions } from './types'
import { getResponseStorage } from './storages'
import { useAsync } from './useAsync'

export function useResponse<T>(
  url: string,
  options: RequestOptions = {},
  storage: Storage = getResponseStorage()
) {
  const key = getResponseKey(url, options)
  const fn = () => request<T>(url, options)
  const [result, reload] = useAsync(key, fn, storage)
  return { ...result, reload }
}

export const getResponseKey = (url: string, options: RequestOptions = {}) => {
  return JSON.stringify({ url, options })
}

async function request<T>(url: string, options: RequestOptions) {
  const res = await fetch(url, options)
  const body = (await res.json()) as T
  return {
    status: res.status,
    headers: res.headers,
    body,
  }
}
