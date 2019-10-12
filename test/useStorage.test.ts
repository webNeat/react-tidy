import { renderHook, act } from '@testing-library/react-hooks'
import { useStorage, createMemoryStorage, setDefaultStorage } from '../src'

describe('useStorage', () => {
  it('reads the value from storage', () => {
    const storage = createMemoryStorage()
    storage.setItem('token', JSON.stringify({ foo: 'bar' }))
    const { result } = renderHook(() => useStorage('token', null, storage))
    const [value] = result.current
    expect(value).toEqual({ foo: 'bar' })
  })
  it('the value is null when missing on storage', () => {
    const storage = createMemoryStorage()
    const { result } = renderHook(() => useStorage('missing', null, storage))
    const [value] = result.current
    expect(value).toBe(null)
  })
  it('sets the value and writes it to storage', () => {
    const storage = createMemoryStorage()
    const { result } = renderHook(() =>
      useStorage<any>('token', { foo: 'bar' }, storage)
    )
    expect(storage.getItem('token')).toBe(JSON.stringify({ foo: 'bar' }))
    act(() => result.current[1]({ foo: 'baz!' }))
    expect(result.current[0]).toEqual({ foo: 'baz!' })
    expect(storage.getItem('token')).toBe(JSON.stringify({ foo: 'baz!' }))
  })
  it('removes the value from storage and sets it as null', () => {
    const storage = createMemoryStorage()
    storage.setItem('token', JSON.stringify({ foo: 'bar' }))
    const { result } = renderHook(() => useStorage('token', null, storage))
    act(() => result.current[1](null))
    expect(result.current[0]).toBe(null)
    expect(storage.getItem('token')).toBe(null)
  })
  it('uses the default storage when no storage is given', () => {
    const storage = createMemoryStorage()
    setDefaultStorage(storage)
    const { result } = renderHook(() => useStorage('token', 'some value'))
    expect(storage.getItem('token')).toBe('"some value"')
    act(() => result.current[1](null))
    expect(storage.getItem('token')).toBe(null)
  })
})
