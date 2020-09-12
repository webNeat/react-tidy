export function isFunction<T extends (...args: any[]) => any>(fn: T): true
export function isFunction<T extends any>(fn: T): boolean
export function isFunction<T extends any>(x: T) {
  return x && {}.toString.call(x) === '[object Function]'
}
