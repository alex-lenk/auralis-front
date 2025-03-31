// src/main.tsx
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'

import ErrorBoundary from '@/App/providers/ErrorBoundary'
import { StoreContext } from '@/App/providers/StoreContext'
import rootStore from '@/stores/RootStore'
import router from '@/router'

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <StoreContext.Provider value={ rootStore }>
      <RouterProvider router={ router } />
    </StoreContext.Provider>
  </ErrorBoundary>,
)
