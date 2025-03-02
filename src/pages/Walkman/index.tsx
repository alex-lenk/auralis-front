import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Loader, Play } from 'lucide-react'

import { useStore } from '@/stores/StoreContext'
import { Button } from '@/components/ui/Button'

const Walkman = observer(() => {
  const { deviceFingerprintStore } = useStore()

  useEffect(() => {
    deviceFingerprintStore.loadFingerprint()
  }, [deviceFingerprintStore])

  if (deviceFingerprintStore.loading) {
    return <Loader className="animate-ping" size={ 48 } strokeWidth={ 3 } absoluteStrokeWidth />
  }

  return (
    <div className="container mx-auto flex flex-col items-center justify-center h-screen p-6 text-center">
      <div className="mb-10">
        ID {deviceFingerprintStore.fingerprint.fingerprintHash}
      </div>

      <div className="flex justify-center">
        <div className="ml-5 mr-5">
          <Button variant="secondary">Focus</Button>
        </div>

        <div className="ml-5 mr-5">
          <Button variant="secondary">Relax</Button>
        </div>
      </div>

      <div className="flex justify-center">
        <Button variant="secondary">
          <Play size={48} strokeWidth={3} absoluteStrokeWidth />
        </Button>
      </div>
    </div>
  )
})

export default Walkman
