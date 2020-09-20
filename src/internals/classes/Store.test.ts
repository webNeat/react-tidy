import {Store} from './Store'

describe('internals > Store', () => {
  it('sets and gets values', () => {
    const store = new Store()
    expect(store.get('foo')).toBeUndefined()
    store.set('foo', 'bar')
    expect(store.get('foo')).toBe('bar')
  })
  it('calls listeners when value changes', () => {
    const listener1 = jest.fn()
    const listener2 = jest.fn()
    const store = new Store()
    store.addListener('key1', listener1)
    store.addListener('key2', listener2)
    store.set('key1', 'some value')
    expect(listener1).toBeCalledTimes(1)
    expect(listener1).toBeCalledWith('some value')
    expect(listener2).toBeCalledTimes(0)
  })
  it('adds and removes listeners', () => {
    const listener1 = jest.fn()
    const store = new Store()
    store.addListener('key1', listener1)
    store.set('key1', 'some value')
    expect(listener1).toBeCalledTimes(1)
    expect(listener1).toBeCalledWith('some value')

    store.removeListener('key1', () => {})
    store.set('key1', 'some other value')
    expect(listener1).toBeCalledTimes(2)
    expect(listener1).toBeCalledWith('some value')

    store.removeListener('key1', listener1)
    store.set('key1', 'some other value')
    expect(listener1).toBeCalledTimes(2)
  })

  it('gets all data', () => {
    const store = new Store()
    store.set('key1', 'foo')
    store.set('key2', 'bar')
    expect(store.getAll()).toEqual({
      key1: 'foo',
      key2: 'bar',
    })
  })

  it('sets all data', () => {
    const listener1 = jest.fn()
    const listener2 = jest.fn()
    const store = new Store()
    store.addListener('key1', listener1)
    store.addListener('key2', listener2)
    store.setAll({
      key1: 'foo',
      key3: 'baz',
    })
    expect(store.get('key1')).toBe('foo')
    expect(store.get('key2')).toBeUndefined()
    expect(store.get('key3')).toBe('baz')
    expect(listener1).toBeCalledTimes(1)
    expect(listener1).toBeCalledWith('foo')
    expect(listener2).toBeCalledTimes(0)
  })
})
