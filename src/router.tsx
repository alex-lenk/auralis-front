import { createBrowserRouter } from 'react-router'

import App from '@/App'
import ErrorBoundary from '@/App/providers/ErrorBoundary'
import Home from '@/pages/Home'
import Walkman from '@/pages/Walkman'
import { urlPage } from '@/shared/enum/urlPage'

const router = createBrowserRouter([
  {
    path: urlPage.Index,
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <Home /> },
      { path: urlPage.Walkman, element: <Walkman /> },
    ],
  },
])

export default router
