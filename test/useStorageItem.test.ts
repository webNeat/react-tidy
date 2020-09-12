import {useStorageItem} from '../src'
import {renderHook, act, cleanup} from '@testing-library/react-hooks'

describe('useStorageItem', () => {
  beforeEach(() => {
    localStorage.clear()
  })
  afterEach(cleanup)

  it('reads the value from storage', () => {
    localStorage.setItem('token', JSON.stringify({foo: 'bar'}))
    const {result} = renderHook(() => useStorageItem('token'))
    const [value] = result.current
    expect(value).toEqual({foo: 'bar'})
  })
  it('the value is null when missing on storage', () => {
    const {result} = renderHook(() => useStorageItem('missing'))
    const [value] = result.current
    expect(value).toBe(null)
  })
  it('sets the value and writes it to storage', () => {
    const {result} = renderHook(() => useStorageItem<any>('token', {foo: 'bar'}))
    expect(localStorage.getItem('token')).toBe(JSON.stringify({foo: 'bar'}))
    act(() => result.current[1]({foo: 'baz!'}))
    expect(result.current[0]).toEqual({foo: 'baz!'})
    expect(localStorage.getItem('token')).toBe(JSON.stringify({foo: 'baz!'}))
  })
  it('removes the value from storage and sets it as null', () => {
    localStorage.setItem('token', JSON.stringify({foo: 'bar'}))
    const {result} = renderHook(() => useStorageItem('token'))
    act(() => result.current[1](null))
    expect(result.current[0]).toBe(null)
    expect(localStorage.getItem('token')).toBe(null)
  })
})
