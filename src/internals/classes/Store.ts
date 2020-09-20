import {StrMap} from '../types'

type Listener = (value: any) => void

export class Store {
  data: StrMap<any> = {}
  listeners: StrMap<Set<Listener>> = {}

  set(key: string, value: any) {
    this.data[key] = value
    if (this.listeners[key] !== undefined) {
      this.listeners[key].forEach((fn) => fn(value))
    }
  }

  get(key: string) {
    return this.data[key]
  }

  getAll() {
    return {...this.data}
  }

  clear() {
    this.data = {}
    this.listeners = {}
  }

  setAll(data: StrMap<any>) {
    for (const key in data) {
      this.set(key, data[key])
    }
  }

  addListener(key: string, fn: Listener) {
    if (this.listeners[key] === undefined) {
      this.listeners[key] = new Set()
    }
    this.listeners[key].add(fn)
  }

  removeListener(key: string, fn: Listener) {
    if (this.listeners[key] !== undefined) {
      this.listeners[key].delete(fn)
    }
  }
}
