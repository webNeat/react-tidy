import {renderHook, act, cleanup} from '@testing-library/react-hooks'
import {useRefresh} from './useRefresh'

describe('useRefresh', () => {
  afterEach(cleanup)

  it('rerenders the component when called', () => {
    const fn = jest.fn()
    const {result, unmount} = renderHook(() => {
      fn()
      return useRefresh()
    })
    expect(fn).toBeCalledTimes(1)

    act(() => result.current())
    expect(fn).toBeCalledTimes(2)

    unmount()
    act(() => result.current())
    expect(fn).toBeCalledTimes(2)
  })
})
