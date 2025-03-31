// src/App/providers/StoreContext.ts
import { createContext, useContext } from 'react'
import type { RootStore } from '@/stores/RootStore'
import rootStore from '@/stores/RootStore'

export const StoreContext = createContext<RootStore | null>(null)

export const useStore = () => {
  const store = useContext(StoreContext)
  if (!store) {
    throw new Error('useStore must be used within a StoreContext.Provider')
  }
  return store
}

export default rootStore
