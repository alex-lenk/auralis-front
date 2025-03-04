import { Outlet } from 'react-router'

import '@/App/globals.css'
import '@/App/app.css'
import '@/i18n'
import Header from '@/modules/Header'
import StorageConsent from '@/components/StorageConsent'

const App = () => {
  return (
    <>
      <Header />
      <Outlet />
      <StorageConsent />
    </>
  )
}

export default App
