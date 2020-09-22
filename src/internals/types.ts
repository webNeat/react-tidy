export type StrMap<T> = {
  [key: string]: T
}

export type Lazy<T> = T | (() => T)
