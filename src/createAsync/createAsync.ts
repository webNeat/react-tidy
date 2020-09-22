import React from 'react'
import {useRefresh} from '../useRefresh/useRefresh'
import {AsyncCacheContext} from './AsyncCacheProvider'
import {AsyncFn, AsyncOptions, AsyncState} from './types'

let defaultAsyncOptions: AsyncOptions = {
  autoRun: true,
  rerunIfOlderThen: 30000,
  clearCacheIfUnusedFor: 30000,
}

export function setDefaultAsyncOptions(options: AsyncOptions) {
  defaultAsyncOptions = options
}

export function createAsync<Args extends any[], T>(
  fnKey: string,
  fn: AsyncFn<Args, T>,
  fnOptions: Partial<AsyncOptions> = {}
) {
  fnOptions = {...defaultAsyncOptions, ...fnOptions}
  return (args: Args = [] as any, options: Partial<AsyncOptions> = {}) => {
    const key = JSON.stringify([fnKey, args])
    const settings = {...fnOptions, ...options} as AsyncOptions

    const refresh = useRefresh()
    const cache = React.useContext(AsyncCacheContext)
    if (!cache.has(key)) cache.create(key)

    const store = cache.get(key)

    React.useEffect(() => {
      store.clearTimeout()
      const state = store.get() as AsyncState<T>
      store.addListener(refresh)
      if (
        settings.autoRun &&
        !state.isLoading &&
        (!state.hasResult || state.timestamp < Date.now() - settings.rerunIfOlderThen)
      ) {
        store.run(fn, args)
      }
      return () => {
        store.removeListener(refresh)
        if (!store.hasListeners()) {
          store.setTimeout(() => cache.delete(key), settings.clearCacheIfUnusedFor)
        }
      }
    }, [key])

    const run = () => {
      const state = store.get() as AsyncState<T>
      if (!state.isLoading) store.run(fn, args)
    }
    return {...store.get(), run} as AsyncState<T> & {run: () => void}
  }
}
