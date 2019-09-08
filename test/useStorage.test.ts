import { renderHook, act } from '@testing-library/react-hooks'
import { useStorage, createMemoryStorage } from '../src'

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
    storage.setItem('token', JSON.stringify({ foo: 'bar' }))
    const { result } = renderHook(() => useStorage<any>('token', null, storage))
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
})
