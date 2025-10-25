import { useState } from 'react';
import { useNavigate } from 'react-router';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { Loader } from 'lucide-react';
import { clsx } from 'clsx';

import useStore from '@/stores/StoreContext';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';
import Button from '@/components/Button';
import styles from './styles.module.scss';

const Home = observer(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { deviceFingerprintStore } = useStore();
  const [loading, setLoading] = useState(false);

  useDocumentTitle('Auralis - где звук встречается с безмятежностью');

  const handleButtonClick = async () => {
    setLoading(true);
    await deviceFingerprintStore.handleAnonymousRegistration(navigate);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center grow p-6 text-center">
      <h1 className="mb-5 text-5xl font-bold font-accent">Auralis</h1>

      <p
        className={clsx(styles.introtext, 'text-secondary mb-7 text-lg')}
        dangerouslySetInnerHTML={{ __html: t('homePage.subtitle') }}
      />

      {deviceFingerprintStore.error && (
        <p className="text-red-500 mt-4 mb-6">{deviceFingerprintStore.error}</p>
      )}

      <Button
        onClick={handleButtonClick}
        disabled={loading}
        className={styles.btn}
      >
        {t('homePage.textButton')}
        {loading && <Loader className="animate-spin" size={24} />}
      </Button>
    </div>
  );
});

export default Home;
