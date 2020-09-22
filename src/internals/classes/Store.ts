type Listener<T> = (value?: T) => void

export class Store<T> {
  data?: T
  listeners: Set<Listener<T>>

  constructor(data?: T) {
    this.data = data
    this.listeners = new Set()
  }

  get() {
    return this.data
  }

  set(value?: T) {
    this.data = value
    this.listeners.forEach((fn) => fn(value))
  }

  hasListeners() {
    return this.listeners.size > 0
  }

  addListener(fn: Listener<T>) {
    this.listeners.add(fn)
  }

  removeListener(fn: Listener<T>) {
    this.listeners.delete(fn)
  }
}
