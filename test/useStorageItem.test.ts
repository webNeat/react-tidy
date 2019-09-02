import { renderHook, act } from '@testing-library/react-hooks'
import { useStorageItem } from '../src'

describe('useStorageItem', () => {
  it('reads the value from localStorage', () => {
    localStorage.setItem('token', 'aaa')
    const { result } = renderHook(() => useStorageItem('token'))
    expect(result.current.value).toBe('aaa')
  })
  it('the value is null when missing on localStorage', () => {
    const { result } = renderHook(() => useStorageItem('missing'))
    expect(result.current.value).toBe(null)
  })
  it('sets the value and writes it to localStorage', () => {
    localStorage.setItem('token', 'aaa')
    const { result } = renderHook(() => useStorageItem('token'))
    act(() => result.current.set('something else'))
    expect(result.current.value).toBe('something else')
    expect(localStorage.getItem('token')).toBe('something else')
  })
  it('removes the value from localStorage and sets it as null', () => {
    localStorage.setItem('token', 'aaa')
    const { result } = renderHook(() => useStorageItem('token'))
    act(() => result.current.remove())
    expect(result.current.value).toBe(null)
    expect(localStorage.getItem('token')).toBe(null)
  })
})
