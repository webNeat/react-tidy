import React, { Suspense } from 'react'
import { act } from 'react-dom/test-utils'
import { render } from '@testing-library/react'
import { useAsync, createMemoryStorage } from '../src'

const storage = createMemoryStorage()

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const Resolve = ({ data, ms }: any) => {
  const [result] = useAsync(
    'key',
    async () => {
      await delay(ms)
      return data
    },
    storage
  )
  return <p>{JSON.stringify(result)}</p>
}

describe('useAsync', () => {
  afterEach(storage.clear)
  it('renders fallback while waiting for the promise', async () => {
    const { container } = render(
      <Suspense fallback={<p>Loading...</p>}>
        <Resolve data="some data" ms={100} />
      </Suspense>
    )
    expect(container.innerHTML).toBe('<p>Loading...</p>')
  })

  it('renders the result when the promise resolves', async () => {
    let container: any = null
    await act(async () => {
      container = render(
        <Suspense fallback={<p>Loading...</p>}>
          <Resolve data="some data" ms={100} />
        </Suspense>
      ).container
      await delay(100)
    })
    expect(container.innerHTML).toBe('<p>"some data"</p>')
  })

  it('caches the result for next renders', async () => {
    let result: any = null
    await act(async () => {
      result = render(
        <Suspense fallback={<p>Loading...</p>}>
          <Resolve data="some data" ms={100} />
        </Suspense>
      )
      await delay(100)
    })
    result.rerender(
      <Suspense fallback={<p>Loading...</p>}>
        <Resolve data="some data" ms={100} />
      </Suspense>
    )
    expect(result.container.innerHTML).toBe('<p>"some data"</p>')
  })
})
