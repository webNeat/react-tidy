import React from 'react'

export function usePrevious<T>(value: T, count = 1) {
  const [history, setHistory] = React.useState<T[]>([])
  React.useEffect(() => {
    if (history.length > count) {
      history.pop()
    }
    setHistory([value, ...history])
  }, [value])
  return history.slice(1)
}
