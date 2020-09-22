import React from 'react'
import {AsyncCache} from './AsyncCache'

export const defaultAsyncCache = new AsyncCache()
export const AsyncCacheContext = React.createContext(defaultAsyncCache)
export const AsyncCacheProvider = AsyncCacheContext.Provider
