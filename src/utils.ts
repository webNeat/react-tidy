export function isFunction(x: any) {
  return x && {}.toString.call(x) === '[object Function]'
}
