import {Store, StrMap} from './internals'

const store = new Store()

export function getStore() {
  return store
}

export function getStoredData() {
  return store.getAll()
}

export function setStoredData(data: StrMap<any>) {
  store.setAll(data)
}
