import {isFunction} from './isFunction'

test('utils > isFunction', () => {
  const arrowFn = () => 1
  const asyncArrowFn = async () => 1
  function fn() {
    return 1
  }
  async function asyncFn() {
    return 1
  }
  function* generator() {
    return 1
  }
  async function* asyncGenerator() {
    return 1
  }
  expect(isFunction(0)).toBe(false)
  expect(isFunction('Yo')).toBe(false)
  expect(isFunction(fn)).toBe(true)
  expect(isFunction(asyncFn)).toBe(true)
  expect(isFunction(arrowFn)).toBe(true)
  expect(isFunction(asyncArrowFn)).toBe(true)
  expect(isFunction(generator)).toBe(true)
  expect(isFunction(asyncGenerator)).toBe(true)
})
