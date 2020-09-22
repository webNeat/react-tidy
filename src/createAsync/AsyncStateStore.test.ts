import {AsyncStateStore} from './AsyncStateStore'

describe('internals > AsyncStateStore', () => {
  const resolve = (data: any, ms: number) => jest.fn(() => new Promise((res) => setTimeout(() => res(data), ms)))
  const reject = (err: any, ms: number) => jest.fn(() => new Promise((_, rej) => setTimeout(() => rej(err), ms)))

  beforeEach(() => {
    jest.useFakeTimers()
  })
  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it(`sets the initial state`, () => {
    const fn = resolve('some data', 100)
    const store = new AsyncStateStore()
    expect(store.get()).toMatchObject({hasResult: false, isLoading: false, timestamp: 0})
    expect(fn).not.toBeCalled()
  })

  it(`runs the async function and notifies listeners when it resolves`, async () => {
    const fn = resolve('some data', 100)
    const listener1 = jest.fn()
    const listener2 = jest.fn()
    const store = new AsyncStateStore()
    store.addListener(listener1)
    store.addListener(listener2)
    expect(store.get()).toMatchObject({hasResult: false, isLoading: false, timestamp: 0})
    expect(fn).not.toBeCalled()

    store.run(fn, [])
    expect(store.get()).toMatchObject({hasResult: false, isLoading: true})
    expect(fn).toBeCalled()

    await jest.advanceTimersByTime(100)
    await jest.advanceTimersByTime(10)

    expect(store.get()).toMatchObject({hasResult: true, isLoading: false, data: 'some data', error: undefined})
    expect(listener1).toBeCalledWith(store.get())
    expect(listener2).toBeCalledWith(store.get())
  })

  it(`runs the async function and notifies listeners when it rejects`, async () => {
    const fn = reject('Oooops!', 100)
    const listener1 = jest.fn()
    const listener2 = jest.fn()

    const store = new AsyncStateStore()
    store.addListener(listener1)
    store.addListener(listener2)
    expect(store.get()).toMatchObject({hasResult: false, isLoading: false, timestamp: 0})
    expect(fn).not.toBeCalled()

    store.run(fn, [])
    expect(store.get()).toMatchObject({hasResult: false, isLoading: true})
    expect(fn).toBeCalled()

    await jest.advanceTimersByTime(100)
    await jest.advanceTimersByTime(10)
    expect(store.get()).toMatchObject({hasResult: true, isLoading: false, data: undefined, error: 'Oooops!'})
    expect(listener1).toBeCalledWith(store.get())
    expect(listener2).toBeCalledWith(store.get())
  })

  it(`waits for the result to be avaible`, async () => {
    const fn = resolve('some data', 100)
    const done = jest.fn()
    const store = new AsyncStateStore()
    const waitThenCallDone = async () => {
      done(await store.wait())
    }
    store.run(fn, [])
    waitThenCallDone()
    expect(done).not.toBeCalled()
    await jest.advanceTimersByTime(100)
    await jest.advanceTimersByTime(1)
    await jest.advanceTimersByTime(1)
    expect(done).toBeCalledWith(true)
  })

  it(`doesn't wait if the result is already avaible`, async () => {
    const fn = resolve('some data', 100)
    const done = jest.fn()
    const store = new AsyncStateStore()
    const waitThenCallDone = async () => {
      done(await store.wait())
    }
    store.run(fn, [])
    await jest.advanceTimersByTime(100)
    await jest.advanceTimersByTime(1)
    expect(store.get()).toMatchObject({isLoading: false})

    waitThenCallDone()
    await jest.advanceTimersByTime(1)
    expect(done).toBeCalledWith(false)
  })
})
