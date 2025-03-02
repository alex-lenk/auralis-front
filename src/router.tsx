import { createBrowserRouter } from 'react-router'

import App from '@/App'
import ErrorBoundary from '@/App/providers/ErrorBoundary'
import Home from '@/pages/Home'
import Walkman from '@/pages/Walkman'

export enum urlPage {
  Index = '/',
  Walkman = '/walkman',
  SignIn = '/auth/login',
}

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
