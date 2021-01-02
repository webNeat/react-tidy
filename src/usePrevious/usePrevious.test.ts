import React from 'react'
import {usePrevious} from './usePrevious'
import {renderHook, act, cleanup} from '@testing-library/react-hooks'

describe('usePrevious', () => {
  afterEach(cleanup)

  it('returns previous value', () => {
    const {result} = renderHook(() => {
      const [value, setValue] = React.useState(1)
      const previous = usePrevious(value)
      return {previous, setValue}
    })
    expect(result.current.previous).toEqual([])

    act(() => {
      result.current.setValue(2)
    })
    expect(result.current.previous).toEqual([1])

    act(() => {
      result.current.setValue(2)
    })
    expect(result.current.previous).toEqual([1])

    act(() => {
      result.current.setValue(3)
    })
    act(() => {
      result.current.setValue(4)
    })
    expect(result.current.previous).toEqual([3])
  })

  it('returns multiple previous values', () => {
    const {result} = renderHook(() => {
      const [value, setValue] = React.useState(1)
      const previous = usePrevious(value, 3)
      return {previous, setValue}
    })
    expect(result.current.previous).toEqual([])

    act(() => {
      result.current.setValue(2)
    })
    expect(result.current.previous).toEqual([1])

    act(() => {
      result.current.setValue(2)
    })
    expect(result.current.previous).toEqual([1])

    act(() => {
      result.current.setValue(3)
    })
    act(() => {
      result.current.setValue(4)
    })
    expect(result.current.previous).toEqual([3, 2, 1])

    act(() => {
      result.current.setValue(5)
    })
    expect(result.current.previous).toEqual([4, 3, 2])
  })
})
