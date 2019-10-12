import { createMemoryStorage } from './createMemoryStorage'
import { Storage } from './types'

const storages = {
  async: createMemoryStorage(),
  default: createMemoryStorage(),
  response: createMemoryStorage(),
}

export const getDefaultStorage = () => storages.default
export const setDefaultStorage = (storage: Storage) => {
  storages.default = storage
}

export const getAsyncStorage = () => storages.async
export const setAsyncStorage = (storage: Storage) => {
  storages.async = storage
}

export const getResponseStorage = () => storages.response
export const setResponseStorage = (storage: Storage) => {
  storages.response = storage
}
