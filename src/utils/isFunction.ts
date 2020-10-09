export function isFunction<T>(x: T): T extends Function ? true : false
export function isFunction(x: any) {
  return !!x && {}.toString.call(x) === '[object Function]'
}
