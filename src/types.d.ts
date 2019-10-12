export interface Storage {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
  clear: () => void
}

export type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: { [key: string]: string }
  body?: string | URLSearchParams | FormData | Blob | ArrayBuffer | DataView
  credentials?: 'omit' | 'same-origin' | 'include'
}

export type Fn<T> = () => T
