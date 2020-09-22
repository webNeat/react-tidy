import {Store} from './Store'

describe('internals > Store', () => {
  it('sets and gets values', () => {
    const store = new Store('foo')
    expect(store.get()).toBe('foo')
    store.set('bar')
    expect(store.get()).toBe('bar')
  })

  it('calls listeners when value changes', () => {
    const fn = jest.fn()
    const store = new Store('foo')
    store.addListener(fn)
    store.set('some value')
    expect(fn).toBeCalledTimes(1)
    expect(fn).toBeCalledWith('some value')
  })

  it('adds and removes listeners', () => {
    const fn = jest.fn()
    const store = new Store('foo')
    expect(store.hasListeners()).toBe(false)
    store.addListener(fn)
    expect(store.hasListeners()).toBe(true)
    store.set('some value')
    expect(fn).toBeCalledTimes(1)
    expect(fn).toBeCalledWith('some value')

    store.removeListener(() => {})
    expect(store.hasListeners()).toBe(true)
    store.set('some other value')
    expect(fn).toBeCalledTimes(2)
    expect(fn).toBeCalledWith('some value')

    store.removeListener(fn)
    expect(store.hasListeners()).toBe(false)
    store.set('some other value')
    expect(fn).toBeCalledTimes(2)
  })
})
