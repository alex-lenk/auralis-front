import { createBrowserRouter } from 'react-router'

import App from '@/App'
import ErrorBoundary from '@/App/providers/ErrorBoundary'
import Home from '@/pages/Home'
import Play from '@/pages/Play/Play'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <Home /> },
      { path: 'play', element: <Play /> },
    ],
  },
])

export default router
