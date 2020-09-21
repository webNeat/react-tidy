import React from 'react'
import {Store, StrMap} from './internals'

const store = new Store()
export const StoreContext = React.createContext(store)
export const StoreProvider = StoreContext.Provider

export function getStoredData() {
  return store.getAll()
}

export function setStoredData(data: StrMap<any>) {
  store.setAll(data)
}
