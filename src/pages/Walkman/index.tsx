import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { observer } from 'mobx-react-lite'
import { Loader, Play, Pause, Volume2, VolumeOff } from 'lucide-react'

import { useStore } from '@/stores/StoreContext'
import useDocumentTitle from '@/shared/hooks/useDocumentTitle'
import { urlPage } from '@/shared/enum/urlPage'
import { Button } from '@/components/ui/Button'
import { Slider } from '@/components/ui/Slider'

const Walkman = observer(() => {
  const { deviceFingerprintStore, audioStore } = useStore()
  const navigate = useNavigate()

  useDocumentTitle('Play: Focus - Auralis: где звук встречается с безмятежностью')

  useEffect(() => {
    if (!deviceFingerprintStore.fingerprint.fingerprintHash) {
      navigate(urlPage.Index)
    }
  }, [deviceFingerprintStore.fingerprint.fingerprintHash, navigate])

  if (deviceFingerprintStore.loading) {
    return <Loader className="animate-spin mx-auto" size={ 48 } strokeWidth={ 3 } absoluteStrokeWidth />
  }

  return (
    <div className="container mx-auto mt-auto flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Focus</h1>
        <p className="text-sm text-gray-500">Your ID: { deviceFingerprintStore.fingerprint.fingerprintHash }</p>
      </div>

      <div className="flex space-x-4 mb-6">
        <Button variant="default" className="px-4 py-2">Focus</Button>
        <Button variant="secondary" className="px-4 py-2">Relax</Button>
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
    </div>
  )
})

export default Walkman
