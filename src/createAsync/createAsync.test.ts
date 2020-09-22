import {renderHook, act, cleanup} from '@testing-library/react-hooks'
import {createAsync} from './createAsync'
import {defaultAsyncCache} from './AsyncCacheProvider'

describe('createAsync', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })
  afterEach(async () => {
    await act(async () => {
      jest.runOnlyPendingTimers()
      cleanup()
    })
    jest.useRealTimers()
  })

  const resolve = (data: any, ms: number) => new Promise((res) => setTimeout(() => res(data), ms))
  const reject = (data: any, ms: number) => new Promise((_, rej) => setTimeout(() => rej(data), ms))
  const useSquare = createAsync('square', (x) => resolve(x * x, 200))
  const useError = createAsync('error', () => reject('Ooops!', 200))

  it(`runs the async function and sets the data and timestamp when it resolves`, async () => {
    let hook: any
    act(() => {
      hook = renderHook(() => useSquare([1]))
    })
    expect(hook.result.current).toMatchObject({isLoading: true, hasResult: false, data: undefined, error: undefined})
    await act(async () => {
      jest.advanceTimersByTime(100)
    })
    expect(hook.result.current).toMatchObject({isLoading: true, hasResult: false, data: undefined, error: undefined})
    await act(async () => {
      jest.advanceTimersByTime(100)
    })
    expect(hook.result.current.timestamp).toBeGreaterThan(Date.now() - 100)
    expect(hook.result.current).toMatchObject({isLoading: false, hasResult: true, data: 1, error: undefined})
  })

  it(`runs the async function and sets the error and timestamp when it rejects`, async () => {
    let hook: any
    act(() => {
      hook = renderHook(() => useError())
    })
    expect(hook.result.current).toMatchObject({isLoading: true, hasResult: false, data: undefined, error: undefined})
    await act(async () => {
      jest.advanceTimersByTime(100)
    })
    expect(hook.result.current).toMatchObject({isLoading: true, hasResult: false, data: undefined, error: undefined})
    await act(async () => {
      jest.advanceTimersByTime(100)
    })
    expect(hook.result.current.timestamp).toBeGreaterThan(Date.now() - 100)
    expect(hook.result.current).toMatchObject({isLoading: false, hasResult: true, data: undefined, error: 'Ooops!'})
  })

  it(`doesn't rerun the async function when a result already exists`, async () => {
    let hook: any
    await act(async () => {
      hook = renderHook(() => useSquare([2]))
      jest.advanceTimersByTime(210)
    })
    hook.unmount()

    act(() => {
      hook = renderHook(() => useSquare([2]))
    })
    expect(hook.result.current).toMatchObject({isLoading: false, hasResult: true, data: 4, error: undefined})
  })

  it(`runs the async function only once when called multiple times and updates all hooks`, async () => {
    const fn = jest.fn(() => resolve('The result', 100))
    const useAsync = createAsync('runs-once', fn)
    let hook1: any
    let hook2: any
    let hook3: any
    act(() => {
      hook1 = renderHook(() => useAsync())
      hook2 = renderHook(() => useAsync())
      hook3 = renderHook(() => useAsync())
    })
    expect(hook1.result.current).toMatchObject({isLoading: true, hasResult: false, data: undefined, error: undefined})
    expect(hook2.result.current).toMatchObject({isLoading: true, hasResult: false, data: undefined, error: undefined})
    expect(hook3.result.current).toMatchObject({isLoading: true, hasResult: false, data: undefined, error: undefined})

    await act(async () => {
      jest.advanceTimersByTime(100)
    })
    expect(fn).toBeCalledTimes(1)
    expect(hook1.result.current).toMatchObject({
      isLoading: false,
      hasResult: true,
      data: 'The result',
      error: undefined,
    })
    expect(hook2.result.current).toMatchObject({
      isLoading: false,
      hasResult: true,
      data: 'The result',
      error: undefined,
    })
    expect(hook3.result.current).toMatchObject({
      isLoading: false,
      hasResult: true,
      data: 'The result',
      error: undefined,
    })
  })

  it(`reruns the async function on demand and updates the hooks using it`, async () => {
    const fn = jest.fn(() => resolve('The result', 100))
    const useAsync = createAsync('reruns', fn)
    let hook1: any
    let hook2: any
    let hook3: any
    await act(async () => {
      hook1 = renderHook(() => useAsync())
      hook2 = renderHook(() => useSquare([3]))
      hook3 = renderHook(() => useAsync())
      jest.advanceTimersByTime(200)
    })
    expect(fn).toBeCalledTimes(1)
    expect(hook1.result.current).toMatchObject({
      isLoading: false,
      hasResult: true,
      data: 'The result',
      error: undefined,
    })
    expect(hook2.result.current).toMatchObject({isLoading: false, hasResult: true, data: 9, error: undefined})
    expect(hook3.result.current).toMatchObject({
      isLoading: false,
      hasResult: true,
      data: 'The result',
      error: undefined,
    })

    act(() => {
      hook1.result.current.run()
    })
    expect(hook1.result.current).toMatchObject({isLoading: true, hasResult: true, data: 'The result', error: undefined})
    expect(hook2.result.current).toMatchObject({isLoading: false, hasResult: true, data: 9, error: undefined})
    expect(hook3.result.current).toMatchObject({isLoading: true, hasResult: true, data: 'The result', error: undefined})
    await act(async () => {
      jest.advanceTimersByTime(100)
    })
    expect(fn).toBeCalledTimes(2)
    expect(hook1.result.current).toMatchObject({
      isLoading: false,
      hasResult: true,
      data: 'The result',
      error: undefined,
    })
    expect(hook2.result.current).toMatchObject({isLoading: false, hasResult: true, data: 9, error: undefined})
    expect(hook3.result.current).toMatchObject({
      isLoading: false,
      hasResult: true,
      data: 'The result',
      error: undefined,
    })
  })

  it(`doesn't run the async function on mount if options.autoRun is false`, async () => {
    const hook = renderHook(() => useSquare([4], {autoRun: false}))
    expect(hook.result.current).toMatchObject({isLoading: false, hasResult: false, data: undefined, error: undefined})
    await act(async () => {
      jest.advanceTimersByTime(300)
    })
    expect(hook.result.current).toMatchObject({isLoading: false, hasResult: false, data: undefined, error: undefined})
    await act(async () => {
      hook.result.current.run()
      jest.advanceTimersByTime(200)
    })
    expect(hook.result.current).toMatchObject({isLoading: false, hasResult: true, data: 16, error: undefined})
  })

  it(`reruns the async function if the last result is older than options.rerunIfOlderThen`, async () => {
    const fn = jest.fn(() => resolve('The result', 100))
    const useAsync = createAsync('rerunIfOlder', fn, {rerunIfOlderThen: 200})
    let hook: any
    await act(async () => {
      renderHook(() => useAsync())
      jest.advanceTimersByTime(100)
    })
    expect(fn).toBeCalledTimes(1)

    hook = renderHook(() => useAsync())
    expect(fn).toBeCalledTimes(1)

    const key = JSON.stringify(['rerunIfOlder', []])
    act(() => {
      const timestamp = Date.now() - 500
      defaultAsyncCache.setData({
        [key]: {...hook.result.current, timestamp},
      })
    })

    await act(async () => {
      renderHook(() => useAsync())
      jest.advanceTimersByTime(100)
    })
    expect(fn).toBeCalledTimes(2)
  })

  it(`clears the cached result if unused for options.clearCacheIfUnusedFor`, async () => {
    let hook: any
    await act(async () => {
      hook = renderHook(() => useSquare([5], {clearCacheIfUnusedFor: 1000}))
      jest.advanceTimersByTime(500)
    })
    hook.unmount()
    const key = JSON.stringify(['square', [5]])
    let data = defaultAsyncCache.getData()
    expect(data[key]).toMatchObject({data: 25})

    act(() => {
      jest.advanceTimersByTime(1000)
    })
    data = defaultAsyncCache.getData()
    expect(data[key]).toBeUndefined()
  })

  it(`doesn't clear the cached result if it becomes used again`, async () => {
    let hook: any
    await act(async () => {
      hook = renderHook(() => useSquare([7], {clearCacheIfUnusedFor: 1000}))
      jest.advanceTimersByTime(500)
    })
    hook.unmount()
    const key = JSON.stringify(['square', [7]])
    let data = defaultAsyncCache.getData()
    expect(data[key]).toMatchObject({data: 49})

    await act(async () => {
      renderHook(() => useSquare([7], {clearCacheIfUnusedFor: 1000}))
      jest.advanceTimersByTime(1000)
    })
    data = defaultAsyncCache.getData()
    expect(data[key]).toMatchObject({data: 49})
  })
})
