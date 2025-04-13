// src/modules/Player/index.tsx

import { observer } from 'mobx-react-lite'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { ListRestart, Pause, Play, Volume2, VolumeOff } from 'lucide-react'

import useStore from '@/stores/StoreContext'
import { musicMode } from '@/shared/enum/playlist'
import { musicModeToIcon } from '@/shared/mapping/musicModeToIcon'
import Sprite from '@/shared/ui/Sprite'
import { Button } from '@/components/ui/Button'
import { Slider } from '@/components/ui/Slider'
import { VisualizerCanvas } from '@/components/VisualizerCanvas'
import styles from './styles.module.scss'

const Player = observer(() => {
  const { audioStore } = useStore()
  const { t } = useTranslation()

  return (
    <>
      <div className={styles.modeDecor}>
        <VisualizerCanvas
          audio={audioStore.audio}
          isPlaying={audioStore.isPlaying}
          mode={audioStore.mode}
        />
      </div>

      <div className={ cn(styles.modeList, 'flex flex-wrap') }>
        { Object.values(musicMode).map(instance => (
          <Button
            key={ instance }
            variant="ghost"
            className={ cn(styles.modeItem, 'relative group', audioStore.mode === instance && styles.modeActive) }
            onClick={ () => audioStore.setMode(instance) }
          >
            <Sprite className={ styles.modeIcon } icon={ musicModeToIcon[instance] } />
            <span
              className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max px-2 py-1 rounded bg-black text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              { t(`musicMode.${ instance }`) }
            </span>
          </Button>
        )) }
      </div>

      <div className={ cn(styles.control, 'flex flex-wrap justify-between items-center') }>
        <div className={ cn(styles.controlBox) }>
          <Button
            variant="secondary"
            size="lg"
            onClick={ () => audioStore.nextSegment() }
            className="relative group mr-6"
          >
            <ListRestart className={ cn(styles.controlIcon) } />
            <span
              className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max px-2 py-1 rounded bg-black text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Обновить список "{ t(`musicMode.${ audioStore.mode }`) }"
            </span>
          </Button>

          <Button variant="secondary" size="lg" onClick={ () => audioStore.togglePlay() } className="relative group">
            { audioStore.isPlaying ? <Pause className={ cn(styles.controlIcon) } /> :
              <Play className={ cn(styles.controlIcon) } /> }
            <span
              className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max px-2 py-1 rounded bg-black text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              { audioStore.isPlaying ? 'Пауза' : 'Воспроизвести' }
            </span>
          </Button>
        </div>

        <div className={ cn(styles.controlVolume, 'flex') }>
          <div className="flex items-center space-x-4 ml-auto">
            <Button variant="secondary" onClick={ () => audioStore.toggleMute() }>
              { audioStore.isMuted ? <VolumeOff size={ 24 } /> : <Volume2 size={ 24 } /> }
            </Button>

            <Slider
              className="w-32"
              defaultValue={ [audioStore.volume] }
              max={ 100 }
              step={ 1 }
              onValueChange={ (v) => audioStore.setVolume(v[0]) }
            />
          </div>
        </div>
      </div>
    </>
  )
})

export default Player
