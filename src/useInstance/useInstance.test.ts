import {useInstance} from './useInstance'
import {renderHook, act, cleanup} from '@testing-library/react-hooks'

describe('useInstance', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    Counter.count = 0
    jest.runOnlyPendingTimers()
    cleanup()
    jest.useRealTimers()
  })

  it('reacts to the instance changes', () => {
    const {result} = renderHook(() => useInstance(Counter, 0))
    expect(result.current.value).toBe(0)

    act(() => {
      result.current.increment()
    })
    expect(result.current.value).toBe(1)

    act(() => {
      result.current.increment()
      result.current.increment()
    })
    expect(result.current.value).toBe(3)

    act(() => {
      result.current.decrement()
    })
    expect(result.current.value).toBe(2)

    act(() => {
      result.current.reset()
    })
    expect(result.current.value).toBe(0)
  })

  it('creates a new instance when called with new args', () => {
    const {result, rerender} = renderHook((n: number) => useInstance(Counter, n), {initialProps: 0})
    expect(result.current.value).toBe(0)
    expect(Counter.count).toBe(1)

    rerender(0)
    expect(result.current.value).toBe(0)
    expect(Counter.count).toBe(1)

    rerender(5)
    expect(result.current.value).toBe(5)
    expect(Counter.count).toBe(2)
  })

  it('reacts to returned objects as well', () => {
    const {result} = renderHook(() => useInstance(CountersCollection))
    expect(result.current.has('foo')).toBe(false)

    act(() => {
      result.current.add('foo')
    })
    expect(result.current.has('foo')).toBe(true)
    let foo = result.current.get('foo')
    expect(foo.value).toBe(0)

    act(() => {
      foo.increment()
    })
    expect(result.current.get('foo').value).toBe(1)

    act(() => {
      result.current.add('bar', 2)
    })
    expect(result.current.get('foo').value).toBe(1)
    expect(result.current.get('bar').value).toBe(2)

    act(() => {
      result.current.remove('foo')
    })
    expect(result.current.get('foo')).toBeUndefined()
  })

  it('runs cleanup() if implemented on unmount', () => {
    const foo = jest.fn()
    const bar = jest.fn()

    const {result, unmount} = renderHook(() => useInstance(Scheduler))
    act(() => {
      result.current.schedule(foo, 3000)
      result.current.schedule(bar, 5000)
    })
    expect(foo).toBeCalledTimes(0)
    expect(bar).toBeCalledTimes(0)

    jest.advanceTimersByTime(4000)
    expect(foo).toBeCalledTimes(1)
    expect(bar).toBeCalledTimes(0)

    unmount()
    jest.advanceTimersByTime(2000)
    expect(foo).toBeCalledTimes(1)
    expect(bar).toBeCalledTimes(0)
  })

  class Counter {
    public static count = 0
    private initialValue: number
    public value: number
    constructor(initialValue: number) {
      this.initialValue = this.value = initialValue
      Counter.count++
    }
    increment() {
      this.value++
    }
    decrement() {
      this.value--
    }
    reset() {
      this.value = this.initialValue
    }
  }

  class CountersCollection {
    private counters: {[key: string]: Counter} = {}

    add(name: string, value = 0) {
      this.counters[name] = new Counter(value)
      return this.counters[name]
    }

    has(name: string) {
      return this.counters[name] !== undefined
    }

    get(name: string) {
      return this.counters[name]
    }

    getAll() {
      return this.counters
    }

    remove(name: string) {
      delete this.counters[name]
    }

    removeAll() {
      this.counters = {}
    }
  }

  class Scheduler {
    private timeouts: Array<ReturnType<typeof setTimeout>> = []

    schedule(fn: () => void, ms: number) {
      this.timeouts.push(setTimeout(fn, ms))
    }

    cleanup() {
      for (const timeout of this.timeouts) {
        clearTimeout(timeout)
      }
    }
  }
})
