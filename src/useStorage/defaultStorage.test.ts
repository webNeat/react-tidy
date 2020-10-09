import {createMemoryStorage} from './createMemoryStorage'
import {getDefaultStorage, setDefaultStorage} from './defaultStorage'

describe('defaultStorage', () => {
  test('it can set and get default storage', () => {
    expect(getDefaultStorage()).toBe(window.localStorage)
    const storage = createMemoryStorage()
    setDefaultStorage(storage)
    expect(getDefaultStorage()).toBe(storage)
  })
})
