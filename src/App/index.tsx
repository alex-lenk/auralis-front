import { Outlet } from 'react-router'

import '@/App/globals.css'
import '@/App/app.css'
import '@/i18n'
import Header from '@/modules/Header'
import Footer from '@/components/Footer'
import StorageConsent from '@/components/StorageConsent'

const App = () => {
  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <Outlet />
      <Footer />
      <StorageConsent />
    </main>
  )
}

export default App
