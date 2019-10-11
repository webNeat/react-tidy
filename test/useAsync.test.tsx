import React, { Suspense } from 'react'
import { act } from 'react-dom/test-utils'
import { render, fireEvent } from '@testing-library/react'
import { useAsync, createMemoryStorage } from '../src'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const storage = createMemoryStorage()

type AsyncProps = {
  name: string
  fn: () => Promise<string | number>
}

const Async = ({ name, fn }: AsyncProps) => {
  const [data, rerun] = useAsync(name, fn, storage)
  return (
    <>
      <p>{data}</p>
      <button onClick={rerun}>Rerun</button>
    </>
  )
}

const Example = ({ name, fn }: AsyncProps) => (
  <Suspense fallback={<p>Loading...</p>}>
    <Async {...{ name, fn }} />
  </Suspense>
)

class ErrorBoundary extends React.Component {
  componentDidCatch() {}
  render() {
    return <p>Error!</p>
  }
}

describe('useAsync', () => {
  it('renders fallback while waiting for the promise', async () => {
    const fn = async () => {
      await delay(20)
      return 'something'
    }
    const { container } = render(<Example name="renders-fallback" fn={fn} />)
    expect(container.innerHTML).toBe('<p>Loading...</p>')
  })

  it('renders the result when the promise resolves', async () => {
    const fn = async () => {
      await delay(20)
      return 'something'
    }
    let container: any = null
    await act(async () => {
      container = render(<Example name="renders-result" fn={fn} />).container
      expect(container.innerHTML).toBe('<p>Loading...</p>')
      await delay(20)
    })
    expect(container.innerHTML).toContain('<p>something</p>')
  })

  it('caches the result for next renders', async () => {
    let count = 0
    const fn = async () => {
      count++
      await delay(20)
      return 'something'
    }
    let result: any = null
    await act(async () => {
      result = render(<Example name="caches-result" fn={fn} />)
      expect(result.container.innerHTML).toBe('<p>Loading...</p>')
      await delay(20)
    })
    expect(result.container.innerHTML).toContain('<p>something</p>')
    expect(count).toBe(1)
    result.rerender(<Example name="caches-result" fn={fn} />)
    expect(result.container.innerHTML).toContain('<p>something</p>')
    expect(count).toBe(1)
  })

  it('reruns the async function', async () => {
    let count = 0
    const fn = async () => {
      count++
      await delay(20)
      return 'something'
    }
    let result: any = null
    await act(async () => {
      result = render(<Example name="reruns-function" fn={fn} />)
      expect(result.container.innerHTML).toBe('<p>Loading...</p>')
      await delay(20)
    })
    expect(result.container.innerHTML).toContain('<p>something</p>')
    expect(count).toBe(1)
    await act(async () => {
      fireEvent.click(result.getByText('Rerun'))
      await delay(5)
      expect(result.container.innerHTML).toContain('<p>Loading...</p>')
      await delay(20)
    })
    expect(result.container.innerHTML).toContain('<p style="">something</p>')
    expect(count).toBe(2)
  })

  it('throws when the function fails', async () => {
    const fn = async () => {
      await delay(20)
      throw 'Error'
    }
    let result: any = null
    await act(async () => {
      result = render(
        <ErrorBoundary>
          <Example name="throws-error" fn={fn} />
        </ErrorBoundary>
      )
      await delay(20)
    })
    expect(result.container.innerHTML).toContain('<p>Error!</p>')
  })
})
