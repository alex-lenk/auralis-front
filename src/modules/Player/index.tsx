import { observer } from 'mobx-react-lite'
import cn from 'classnames';
import { useTranslation } from 'react-i18next'
import { Pause, Play, Volume2, VolumeOff } from 'lucide-react'

import { useStore } from '@/App/providers/StoreContext'
import { musicMode } from '@/shared/enum/playlist'
import { musicModeToIcon } from '@/shared/mapping/musicModeToIcon'
import Sprite from '@/shared/ui/Sprite'
import { Button } from '@/components/ui/Button'
import { Slider } from '@/components/ui/Slider'
import styles from './styles.module.scss';

const Player = observer(() => {
  const { audioStore } = useStore()
  const { t } = useTranslation()

  return (
    <>
      <div className={cn(styles.modeList, 'flex flex-wrap mb-6')}>
        { Object.values(musicMode).map(instance => (
          <Button
            key={ instance }
            variant={ 'ghost' }
            className={cn(styles.modeItem, audioStore.mode === instance && styles.modeActive)}
            onClick={ () => audioStore.setMode(instance) }
          >
            <Sprite className={styles.modeIcon} icon={musicModeToIcon[instance]} />
            { t(`musicMode.${instance}`) }
          </Button>
        )) }
      </div>

      <div className="flex flex-wrap justify-between items-center w-full max-w-xl space-y-4">
        <Button variant="secondary" size="lg" onClick={ () => audioStore.togglePlay() }>
          { audioStore.isPlaying ? <Pause size={ 32 } /> : <Play size={ 32 } /> }
        </Button>

        <div className="flex items-center space-x-4">
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
    </>
  )
})

export default Player
