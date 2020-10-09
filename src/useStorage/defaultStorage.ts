import {isInBrowser} from '../utils'
import {createMemoryStorage} from './createMemoryStorage'

type LazyStorage = Storage | (() => Storage)

let defaultStorage: LazyStorage
if (isInBrowser()) {
  defaultStorage = window.localStorage
} else {
  defaultStorage = createMemoryStorage()
}

export function getDefaultStorage() {
  return defaultStorage
}
export function setDefaultStorage(storage: LazyStorage) {
  defaultStorage = storage
}
