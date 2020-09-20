import {renderHook, act, cleanup} from '@testing-library/react-hooks'
import {createSharedState} from './createSharedState'

describe('createSharedState', () => {
  afterEach(cleanup)

  it(`behaves like React.useState`, () => {
    const useCounter = createSharedState('foo', 0)
    const {result} = renderHook(() => useCounter())
    expect(result.current[0]).toBe(0)
    act(() => {
      result.current[1](5)
    })
    expect(result.current[0]).toBe(5)
    act(() => {
      result.current[1]((x) => x * 2)
    })
    expect(result.current[0]).toBe(10)
  })

  it(`shares the state between multiple calls using the same store`, () => {
    const useCounter = createSharedState('bar', 0)
    const {result: a} = renderHook(() => useCounter())
    const {result: b} = renderHook(() => useCounter())
    expect(a.current[0]).toBe(0)
    expect(b.current[0]).toBe(0)
    act(() => {
      a.current[1](5)
    })
    expect(a.current[0]).toBe(5)
    expect(b.current[0]).toBe(5)
  })

  it(`reads the stored state if already exists`, () => {
    const useCounter = createSharedState('baz', 0)
    let hook = renderHook(() => useCounter())
    act(() => {
      hook.result.current[1](11)
    })
    hook.unmount()

    hook = renderHook(() => useCounter())
    expect(hook.result.current[0]).toBe(11)
  })
})
