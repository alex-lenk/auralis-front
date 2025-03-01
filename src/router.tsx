import { createBrowserRouter } from 'react-router'
import App from '@/App'
import ErrorBoundary from '@/App/providers/ErrorBoundary.tsx'
import Home from '@/pages/Home'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <Home /> },
    ],
  },
])

export default router
