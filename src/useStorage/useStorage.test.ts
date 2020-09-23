import {useStorage} from './useStorage'
import {renderHook, act, cleanup} from '@testing-library/react-hooks'

describe('useStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })
  afterEach(cleanup)

  it('reads the value from storage', () => {
    localStorage.setItem('data', JSON.stringify({foo: 'bar'}))
    const {result} = renderHook(() => useStorage('data'))
    const [value] = result.current
    expect(value).toEqual({foo: 'bar'})
  })
  it('the value is null when missing on storage', () => {
    const {result} = renderHook(() => useStorage('missing'))
    const [value] = result.current
    expect(value).toBe(null)
  })
  it('sets the value and writes it to storage', async () => {
    const {result} = renderHook(() => useStorage<number>('counter', 1))
    expect(localStorage.getItem('counter')).toBe('1')
    act(() => result.current[1](4))
    expect(result.current[0]).toEqual(4)
    expect(localStorage.getItem('counter')).toBe('4')
    act(() => result.current[1](5))
    expect(result.current[0]).toEqual(5)
    expect(localStorage.getItem('counter')).toBe('5')
  })
  it('removes the value from storage and sets it as null', () => {
    localStorage.setItem('token', JSON.stringify({foo: 'bar'}))
    const {result} = renderHook(() => useStorage('token'))
    act(() => result.current[1](null))
    expect(result.current[0]).toBe(null)
    expect(localStorage.getItem('token')).toBe(null)
  })
})
