import {StrMap} from '../internals'
import {createSharedState} from '..'

type AsyncFn<T> = (...args: any[]) => Promise<T>

type State<T> = {
  data?: T
  error: any
  isLoading: boolean
  promise?: Promise<void>
  timestamp: number
}

export function createAsync<T, F extends AsyncFn<T>>(fn: F, cacheDuration = 300) {
  const useSharedStore = createSharedState<StrMap<State<T>>>({})
  return (...args: Parameters<F>) => {
    const key = JSON.stringify(args)
    const [store, setStore] = useSharedStore()
    const refresh = () => {
      const promise = fn(...args)
        .then((data) => setStore((x) => ({...x, [key]: {data, error: null, isLoading: false, timestamp: now()}})))
        .catch((error) =>
          setStore((x) => ({...x, [key]: {data: undefined, error, isLoading: false, timestamp: now()}}))
        )
      setStore(
        (x) => ({...x, [key]: {data: undefined, error: null, isLoading: true, promise, timestamp: now()}}),
        false
      )
      return promise
    }
    const state = store[key]
    if (state === undefined || state.timestamp < now() - cacheDuration) throw refresh()
    if (state.isLoading) throw state.promise
    if (state.error) throw state.error
    return [state.data, refresh] as [T, () => Promise<void>]
  }
}

function now() {
  return Date.now() / 1000
}
