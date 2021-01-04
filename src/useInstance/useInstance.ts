import React from 'react'
import {makeProxy} from './makeProxy'
import {useRefresh} from '../useRefresh/useRefresh'

type ClassType<T, Args extends any[]> = {
  new (...args: Args): T
}

export function useInstance<T, Args extends any[]>(Class: ClassType<T, Args>, ...args: Args) {
  const refresh = useRefresh()
  const instance = React.useMemo<T>(() => makeProxy(new Class(...args), refresh), args)
  React.useEffect(() => {
    const currentInstance = instance as any
    return () => currentInstance.cleanup && currentInstance.cleanup()
  }, args)
  return instance
}
