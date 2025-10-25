import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { Loader } from 'lucide-react';

import useStore from '@/stores/StoreContext';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';
import { urlPage } from '@/shared/enum/urlPage';
import Player from '@/modules/Player';
import styles from './styles.module.scss';

const Walkman = observer(() => {
  const { deviceFingerprintStore, audioStore } = useStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useDocumentTitle(t('general.headTitle'));

  useEffect(() => {
    const checkFingerprint = async () => {
      if (!deviceFingerprintStore.fingerprint.fingerprintHash) {
        await deviceFingerprintStore.loadFingerprint();
      }

      if (!deviceFingerprintStore.fingerprint.fingerprintHash) {
        navigate(urlPage.Index);
      } else {
        await audioStore.initialize();
      }
    };

    checkFingerprint();
  }, [deviceFingerprintStore, navigate, audioStore]);

  if (deviceFingerprintStore.loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="container mx-auto flex flex-col items-center justify-center p-6">
      <h1 className={clsx(styles.title, 'font-bold')}>
        {t(`musicMode.${audioStore.mode}`)}
      </h1>

      <Player />
    </div>
  );
});

export default Walkman;
