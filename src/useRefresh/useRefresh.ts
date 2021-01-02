import React from 'react'
import {useIsMounted} from '../useIsMounted/useIsMounted'

export function useRefresh() {
  const [, setVersion] = React.useState(0)
  const isMounted = useIsMounted()
  return () => {
    if (isMounted()) {
      setVersion((x) => x + 1)
    }
  }
}
