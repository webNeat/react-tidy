import {Lazy} from '../types'
import {isFunction} from './isFunction'

export function resolve<T>(value: Lazy<T>) {
  if (isFunction(value)) return (value as any)() as T
  return value as T
}
