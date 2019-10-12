import { createMemoryStorage } from './createMemoryStorage'
import { Storage } from './types'

const storages = {
  default: createMemoryStorage(),
  async: createMemoryStorage(),
  fetch: createMemoryStorage(),
}

export const getDefaultStorage = () => storages.default
export const setDefaultStorage = (storage: Storage) => {
  storages.default = storage
}

export const getAsyncStorage = () => storages.async
export const setAsyncStorage = (storage: Storage) => {
  storages.async = storage
}

export const getFetchStorage = () => storages.fetch
export const setFetchStorage = (storage: Storage) => {
  storages.fetch = storage
}
