import {Store} from '../internals'
import {AsyncFn, AsyncState} from './types'

export class AsyncStateStore<T> extends Store<AsyncState<T>> {
  constructor() {
    super({data: undefined, error: undefined, hasResult: false, isLoading: false, timestamp: 0})
  }

  run<Args extends any[]>(fn: AsyncFn<Args, T>, args: Args) {
    this.set({...(this.get() as AsyncState), isLoading: true, timestamp: Date.now()})
    fn(...args)
      .then((data) => this.set({data, error: undefined, hasResult: true, isLoading: false, timestamp: Date.now()}))
      .catch((error) => this.set({data: undefined, error, hasResult: true, isLoading: false, timestamp: Date.now()}))
  }

  setTimeout(fn: () => void, ms: number) {
    const state = this.get() as AsyncState<T>
    this.set({...state, timeout: setTimeout(fn, ms)})
  }

  clearTimeout() {
    const {timeout} = this.get() as AsyncState
    if (timeout) clearTimeout(timeout)
  }

  async wait() {
    if (!this.data?.isLoading) {
      return false
    }
    const self = this
    await new Promise((resolve) => {
      function listener(value?: AsyncState<any>) {
        if (value && !value.isLoading) {
          self.removeListener(listener)
          resolve()
        }
      }
      self.addListener(listener)
    })
    return true
  }
}
