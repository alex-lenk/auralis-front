import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';

import Button from '@/components/Button';
import { urlPage } from '@/shared/enum/urlPage';

const StorageConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem('storageConsent');
    if (!hasConsented) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('storageConsent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-3 z-50">
      <div className="container mx-auto flex items-center justify-between text-white">
        <div className="text-sm">
          Использую современные технологии, чтобы сайт был удобен для вас.
          <NavLink to={urlPage.Policy} className="ms-2 text-blue-400 hover:underline">
            Подробнее
          </NavLink>
        </div>
        <Button
          variant="transparent"
          onClick={handleClose}
          className="bg-transparent hover:bg-gray-700 text-white border border-white"
        >
          Закрыть
        </Button>
      </div>
    </div>
  );
};

export default StorageConsent;
