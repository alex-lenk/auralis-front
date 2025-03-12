import { observer } from 'mobx-react-lite'
import { Pause, Play, Volume2, VolumeOff } from 'lucide-react'
import { useStore } from '@/stores/StoreContext'
import { musicMode } from '@/shared/enum/playlist'
import { Button } from '@/components/ui/Button'
import { Slider } from '@/components/ui/Slider'

const Player = observer(() => {
  const { audioStore } = useStore()

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-6">
        { Object.values(musicMode).map(instance => (
          <Button
            key={ instance }
            variant={ audioStore.mode === instance ? 'default' : 'secondary' }
            className="px-4 py-2"
            onClick={ () => audioStore.setMode(instance) }
          >
            { instance.charAt(0).toUpperCase() + instance.slice(1).replace('_', ' ') }
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
