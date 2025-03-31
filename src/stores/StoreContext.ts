import { useContext } from 'react'
import { StoreContext } from '@/App/providers/StoreContext'

const useStore = () => useContext(StoreContext)

export default useStore
