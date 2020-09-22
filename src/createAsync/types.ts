export type AsyncFn<Args extends any[], T> = (...args: Args) => Promise<T>
export type AsyncState<T = any> = {
  data?: T
  error?: any
  isLoading: boolean
  hasResult: boolean
  timestamp: number
  timeout?: NodeJS.Timeout
}
export type AsyncOptions = {
  autoRun: boolean
  rerunIfOlderThen: number
  clearCacheIfUnusedFor: number
}
