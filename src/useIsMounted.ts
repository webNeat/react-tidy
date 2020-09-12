import React from 'react'

export function useIsMounted() {
  const ref = React.useRef(true)
  React.useEffect(() => {
    return () => {
      ref.current = false
    }
  }, [])
  return () => ref.current
}
