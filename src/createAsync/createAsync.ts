import React from 'react'
import {StoreContext} from '../store'
import {useRefresh} from '../useRefresh/useRefresh'

type AsyncFn<T> = (...args: any[]) => Promise<T>
type AsyncOptions = {
  autoRun: boolean
  rerunIfOlderThen: number
  clearCacheIfUnusedFor: number
}

type State<T> = {
  data?: T
  error: any
  isLoading: boolean
  hasResult: boolean
  timestamp: number
  timeout?: NodeJS.Timeout
}

const defaultAsyncOptions: AsyncOptions = {
  autoRun: true,
  rerunIfOlderThen: 30000,
  clearCacheIfUnusedFor: 30000,
}

export function createAsync<T, F extends AsyncFn<T>>(key: string, fn: F, options: Partial<AsyncOptions> = {}) {
  key = 'async:' + key
  options = {...defaultAsyncOptions, ...options}
  return (args: Parameters<F> = [] as any, opts: Partial<AsyncOptions> = {}) => {
    const store = React.useContext(StoreContext)
    const callKey = JSON.stringify({key, args})
    const getStored = React.useCallback(() => store.get(callKey) as State<T>, [callKey])
    const setStored = React.useCallback((value?: State<T>) => store.set(callKey, value), [callKey])
    const settings = {...options, ...opts} as AsyncOptions

    if (getStored() === undefined) {
      setStored({data: undefined, error: undefined, hasResult: false, isLoading: false, timestamp: 0})
    }

    const load = () => {
      setStored({...getStored(), isLoading: true, timestamp: Date.now()})
      fn(...args)
        .then((data) => setStored({data, error: undefined, hasResult: true, isLoading: false, timestamp: Date.now()}))
        .catch((error) => setStored({data: undefined, error, hasResult: true, isLoading: false, timestamp: Date.now()}))
    }

    const refresh = useRefresh()

    React.useEffect(() => {
      const current = getStored()
      if (current.timeout) clearTimeout(current.timeout)
      store.addListener(callKey, refresh)
      if (
        settings.autoRun &&
        !current.isLoading &&
        (!current.hasResult || current.timestamp < Date.now() - settings.rerunIfOlderThen)
      ) {
        load()
      }
      return () => {
        store.removeListener(callKey, refresh)
        if (!store.hasListeners(callKey)) {
          const timeout = setTimeout(() => setStored(undefined), settings.clearCacheIfUnusedFor)
          setStored({...getStored(), timeout})
        }
      }
    }, [callKey])

    const run = () => {
      if (!getStored().isLoading) load()
    }
    return {...getStored(), run} as State<T> & {run: () => void}
  }
}
