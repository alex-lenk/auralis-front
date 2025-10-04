import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { clsx } from 'clsx';
import Button from '@/components/Button';
import { Icons } from '@/shared/ui/Sprite/iconsList';
import { Slider } from '@/components/ui/Slider';
import useStore from '@/stores/StoreContext';
import styles from '@/modules/Player/styles.module.scss';

const Control = observer(() => {
  const { audioStore } = useStore();
  const { t } = useTranslation();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    if (isRefreshing) return;

    audioStore.nextSegment();
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <div className={clsx(styles.control, 'flex flex-wrap justify-between items-center')}>
      <Button
        variant="transparent"
        onClick={handleRefresh}
        disabled={isRefreshing}
        className={clsx(
          styles.controlBtn,
          styles.controlBtnUpdate,
          'relative group mr-6',
          isRefreshing && 'opacity-50 pointer-events-none cursor-not-allowed',
        )}
        iconName={Icons.update}
      >
        <span
          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max px-2 py-1 rounded bg-black text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        >
          {t('player.updateList')} "{t(`musicMode.${audioStore.mode}`)}"
        </span>
      </Button>

      <Button
        variant="transparent"
        size="md"
        isIcon={true}
        onClick={() => audioStore.togglePlay()}
        className={clsx(styles.controlBtn, 'relative group')}
        iconName={audioStore.isPlaying ? Icons.pause : Icons.play}
      >
        <span
          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max px-2 py-1 rounded bg-black text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {audioStore.isPlaying ? t('player.pause') : t('player.play')}
        </span>
      </Button>

      <div className={clsx(styles.controlVolume)}>
        <div className="flex items-center space-x-4 ml-auto">
          <Button
            variant="transparent"
            size="md"
            isIcon={true}
            onClick={() => audioStore.toggleMute()}
            iconName={Icons.volume}
            className={clsx(
              styles.controlVolumeBtn, audioStore.isMuted && styles.controlVolumeBtnMuted
            )}
          >
          </Button>

          <Slider
            className="w-32"
            defaultValue={[audioStore.volume]}
            max={100}
            step={1}
            onValueChange={(v) => audioStore.setVolume(v[0])}
          />
        </div>
      </div>
    </div>
  );
});

export default Control;
