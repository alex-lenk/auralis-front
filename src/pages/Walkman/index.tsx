import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Loader, Play, Pause, Volume2, VolumeOff } from 'lucide-react'

import { useStore } from '@/stores/StoreContext'
import { Button } from '@/components/ui/Button'
import { Slider } from '@/components/ui/Slider'

const Walkman = observer(() => {
  const { deviceFingerprintStore, audioStore } = useStore()

  useEffect(() => {
    deviceFingerprintStore.loadFingerprint()
  }, [deviceFingerprintStore])

  if (deviceFingerprintStore.loading) {
    return <Loader className="animate-spin mx-auto" size={ 48 } strokeWidth={ 3 } absoluteStrokeWidth />
  }

  return (
    <div className="container mx-auto flex flex-col items-center justify-center h-screen p-6 text-center">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Focus</h1>
        <p className="text-sm text-gray-500">Your ID: { deviceFingerprintStore.fingerprint.fingerprintHash }</p>
      </div>

      <div className="flex space-x-4 mb-6">
        <Button variant="default" className="px-4 py-2">Focus</Button>
        <Button variant="secondary" className="px-4 py-2">Relax</Button>
      </div>

      <div className="flex flex-wrap justify-between items-center w-full max-w-xl space-y-4">
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

        <Button variant="secondary" size="lg" onClick={ () => audioStore.togglePlay() }>
          { audioStore.isPlaying ? <Pause size={ 32 } /> : <Play size={ 32 } /> }
        </Button>
      </div>
    </div>
  )
})

export default Walkman
