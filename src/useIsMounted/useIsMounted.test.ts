import {useIsMounted} from './useIsMounted'
import {renderHook, act, cleanup} from '@testing-library/react-hooks'

describe('useIsMounted', () => {
  afterEach(cleanup)

  it('returns true if the hook is mounted', () => {
    const {result} = renderHook(() => useIsMounted())
    expect(result.current()).toBe(true)
  })

  it('returns false if the hook is unmounted', () => {
    const {result, unmount} = renderHook(() => useIsMounted())
    expect(result.current()).toBe(true)
    act(() => {
      unmount()
    })
    expect(result.current()).toBe(false)
  })
})
