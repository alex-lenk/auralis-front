import { Outlet } from 'react-router'

import '@/App/globals.css'
import '@/App/app.css'
import '@/i18n';
import Header from '@/modules/Header';

function App() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

export default App
