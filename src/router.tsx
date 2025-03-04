import { createBrowserRouter } from 'react-router'

import App from '@/App'
import ErrorBoundary from '@/App/providers/ErrorBoundary'
import { urlPage } from '@/shared/enum/urlPage'
import Home from '@/pages/Home'
import Walkman from '@/pages/Walkman'
import Policy from '@/pages/Policy'

const router = createBrowserRouter([
  {
    path: urlPage.Index,
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <Home /> },
      { path: urlPage.Walkman, element: <Walkman /> },
      { path: urlPage.Policy, element: <Policy /> },
    ],
  },
])

export default router
