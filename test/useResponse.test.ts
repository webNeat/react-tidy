import { renderHook } from '@testing-library/react-hooks'
import { createMemoryStorage, getResponseKey, useResponse } from '../src'

describe('useResponse', () => {
  beforeAll(() => {
    ;(global as any).Headers = function() {}
  })
  it('reads the response from storage', () => {
    const storage = createMemoryStorage()
    const res = {
      status: 200,
      headers: new Headers(),
      body: { success: true },
    }
    storage.setItem(getResponseKey('/foo'), JSON.stringify(res))
    const { result } = renderHook(() => useResponse('/foo', {}, storage))
    expect(result.current).toMatchObject(res)
  })
})
