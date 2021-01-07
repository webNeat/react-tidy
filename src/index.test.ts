import React from 'react'
import {act, renderHook, cleanup} from '@testing-library/react-hooks'
import {useIsMounted, usePrevious, useRefresh, useStorage, createMemoryStorage} from '.'
import {useInstance} from './useInstance/useInstance'

describe('react-tidy', () => {
  afterEach(cleanup)

  it('exports useIsMounted', () => {
    const {result, unmount} = renderHook(() => {
      return useIsMounted()
    })
    expect(result.current()).toBe(true)
    act(() => {
      unmount()
    })
    expect(result.current()).toBe(false)
  })

  it('exports useRefresh', () => {
    const fn = jest.fn()
    const {result} = renderHook(() => {
      fn()
      return useRefresh()
    })
    expect(fn).toBeCalledTimes(1)
    act(() => {
      result.current()
    })
    expect(fn).toBeCalledTimes(2)
  })

  it('exports useStorage', () => {
    const storage = createMemoryStorage()
    const {result} = renderHook(() => {
      return useStorage('token', 'initial-value', storage)
    })
    expect(result.current[0]).toBe('initial-value')
    expect(storage.getItem('token')).toBe('"initial-value"')

    act(() => {
      result.current[1]('new-value')
    })
    expect(result.current[0]).toBe('new-value')
    expect(storage.getItem('token')).toBe('"new-value"')

    act(() => {
      result.current[1](null)
    })
    expect(result.current[0]).toBe(null)
    expect(storage.getItem('token')).toBe(null)
  })

  it('exports usePrevious', () => {
    const {result} = renderHook(() => {
      const [value, setValue] = React.useState(0)
      const [previous] = usePrevious(value)
      return {value, setValue, previous}
    })
    expect(result.current.previous).toBe(undefined)

    act(() => {
      result.current.setValue(1)
    })
    expect(result.current.previous).toBe(0)
  })

  it('exports usePrevious', () => {
    class Foo {
      field = 1
    }
    const fn = jest.fn()
    const {result} = renderHook(() => {
      fn()
      return useInstance(Foo)
    })

    expect(fn).toBeCalledTimes(1)
    expect(result.current.field).toBe(1)

    act(() => {
      result.current.field = 5
    })
    expect(fn).toBeCalledTimes(2)
    expect(result.current.field).toBe(5)
  })
})
