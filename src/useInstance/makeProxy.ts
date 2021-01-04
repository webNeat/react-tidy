const proxySymbol = Symbol()

export function makeProxy<T extends {}>(target: T, notify: () => void): T {
  if ((target as any)[proxySymbol] === true) {
    return target
  }
  return new Proxy(target, {
    get: makeTrap('get', notify),
    defineProperty: makeTrap('defineProperty', notify),
    deleteProperty: makeTrap('deleteProperty', notify),
  })
}

function makeTrap(trap: keyof typeof Reflect, notify: () => void) {
  return (...args: any[]) => {
    if (trap === 'get' && args[1] === proxySymbol) {
      return true
    }
    const original = Reflect[trap] as any
    let result = original(...args)
    if (trap === 'get' && typeof result === 'object' && result !== null) {
      result = makeProxy(result, notify)
    }
    if (trap !== 'get') {
      notify()
    }
    return result
  }
}
