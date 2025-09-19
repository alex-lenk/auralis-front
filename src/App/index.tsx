import { Outlet } from 'react-router';

import '@/App/globals.css';
import '@/styles/main.scss';
import '@/i18n';
import Header from '@/modules/Header';
import Footer from '@/components/Footer';

const App = () => {
  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <Outlet />
      <Footer />
    </main>
  );
};

export default App;
