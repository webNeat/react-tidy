import React from 'react'
import {getStore} from '../store'
import {useRefresh} from '../useRefresh/useRefresh'

type AsyncFn<T> = (...args: any[]) => Promise<T>

type State<T> = {
  data?: T
  error: any
  isLoading: boolean
  hasResult: boolean
  timestamp: number
}

export function createAsync<T, F extends AsyncFn<T>>(key: string, fn: F) {
  const store = getStore()
  key = 'async:' + key
  return (...args: Parameters<F>) => {
    const callKey = JSON.stringify({key, args})
    const getStored = React.useCallback(() => store.get(callKey), [callKey])
    const setStored = React.useCallback((value: State<T>) => store.set(callKey, value), [callKey])

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
      refresh()
      store.addListener(callKey, refresh)
      return () => store.removeListener(callKey, refresh)
    }, [callKey])

    React.useEffect(() => {
      const current = getStored()
      if (!current.hasResult && !current.isLoading) load()
    }, [callKey])

    const reload = () => {
      if (!getStored().isLoading) load()
    }
    return {...getStored(), reload} as State<T> & {reload: () => void}
  }
}
