import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'

import { StoreContext } from '@/App/providers/StoreContext'
import rootStore from '@/stores/RootStore'
import router from '@/router'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreContext.Provider value={ rootStore }>
      <RouterProvider router={ router } />
    </StoreContext.Provider>
  </StrictMode>,
)
