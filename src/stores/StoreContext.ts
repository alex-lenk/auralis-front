import { useContext } from 'react';

import { StoreContext } from '@/App/providers/StoreContext';

export const useStore = () => useContext(StoreContext);
