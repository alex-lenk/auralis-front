import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import useStore from '@/stores/StoreContext';
import { musicMode } from '@/shared/enum/playlist';
import { musicModeToIcon } from '@/shared/mapping/musicModeToIcon';
import Button from '@/components/Button';
import styles from '@/modules/Player/styles.module.scss';

const ModeList = observer(() => {
  const { audioStore } = useStore();
  const { t } = useTranslation();
  const [modeSwitchLocked, setModeSwitchLocked] = useState(false);

  const handleModeClick = (instance: musicMode) => {
    if (modeSwitchLocked || audioStore.mode === instance) return;

    audioStore.setMode(instance);
    setModeSwitchLocked(true);
    setTimeout(() => setModeSwitchLocked(false), 1500);
  };

  return (
    <div className={clsx(styles.modeList, 'flex flex-wrap')}>
      {Object.values(musicMode).map(instance => (
        <Button
          key={instance}
          variant="transparent"
          size="xl"
          isIcon={true}
          disabled={modeSwitchLocked}
          className={clsx(
            styles.modeItem,
            'relative group',
            audioStore.mode === instance && styles.modeActive,
            modeSwitchLocked && 'opacity-30 pointer-events-none cursor-not-allowed',
          )}
          onClick={() => handleModeClick(instance)}
          iconName={musicModeToIcon[instance]}
        >
          <span
            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max px-2 py-1 rounded bg-black text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          >
            {t(`musicMode.${instance}`)}
          </span>
        </Button>
      ))}
    </div>
  );
});

export default ModeList;
