import { useContext } from 'react';
import { StoreContext } from '@/App/providers/StoreContext.ts';

export const useStore = () => useContext(StoreContext);
