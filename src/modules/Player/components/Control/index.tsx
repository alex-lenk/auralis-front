import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { clsx } from 'clsx';
import Button from '@/components/Button';
import { Icons } from '@/shared/ui/Sprite/iconsList';
import { Slider } from '@/components/ui/Slider';
import useStore from '@/stores/StoreContext';
import styles from './styles.module.scss';

const Control = observer(() => {
  const { audioStore } = useStore();
  const { t } = useTranslation();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isVolumeActive, setIsVolumeActive] = useState(true);
  const widthScreen = document.documentElement.clientWidth;

  const handleRefresh = () => {
    if (isRefreshing) return;

    audioStore.nextSegment();
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const handleToggleVolume = () => {
    setIsVolumeActive((prev) => !prev);
  };

  return (
    <div className={clsx(
      styles.control,
      !isVolumeActive && styles.controlVolumeActive
    )}>
      <div className={clsx(styles.controlUpdate, widthScreen < 1200 && !isVolumeActive && 'd-none')}>
        <Button
          variant="transparent"
          onClick={handleRefresh}
          disabled={isRefreshing}
          isIcon
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
          {t('player.updateList')} «{t(`musicMode.${audioStore.mode}`)}»
        </span>
        </Button>
      </div>

      <div className={clsx(styles.controlPlaying, widthScreen < 1200 && !isVolumeActive && 'd-none')}>
        <Button
          variant="transparent"
          size="md"
          isIcon
          onClick={() => audioStore.togglePlay()}
          className={clsx(styles.controlBtn, 'relative group')}
          iconName={audioStore.isPlaying ? Icons.pause : Icons.play}
        >
        <span
          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max px-2 py-1 rounded bg-black text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        >
          {audioStore.isPlaying ? t('player.pause') : t('player.play')}
        </span>
        </Button>
      </div>

      <div className={styles.controlWrapper}>
        {
          isVolumeActive && (
              <Button
                variant="transparent"
                size="md"
                isIcon
                iconName={Icons.volume}
                onClick={handleToggleVolume}
                className={clsx(
                  styles.controlBtn,
                  styles.controlBtnToggle
                )}
              />
          )
        }

        <div className={clsx(styles.controlVolume, widthScreen < 1200 && isVolumeActive && 'd-none')}>
          <Button
            variant="transparent"
            size="md"
            isIcon
            iconName={Icons.close}
            onClick={handleToggleVolume}
            className={styles.controlBtnClose}
          />

          <Button
            variant="transparent"
            size="md"
            isIcon
            onClick={() => audioStore.toggleMute()}
            iconName={Icons.volume}
            className={clsx(
              styles.controlBtnVolume,
              audioStore.isMuted && styles.controlBtnVolumeMuted,
              'relative group'
            )}
          >
            <span
              className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max px-2 py-1 rounded bg-black text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            >
              {audioStore.isMuted ? t('player.soundOff') : t('player.soundOn')}
            </span>
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
