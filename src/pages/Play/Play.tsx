import { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'

import { useStore } from '@/stores/StoreContext'

const Play = observer(() => {
  const { deviceFingerprintStore } = useStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      await deviceFingerprintStore.loadFingerprint()
      setLoading(false)
    }

    init()
  }, [deviceFingerprintStore])

  if (loading) return <div>Loading...</div>
  console.log('deviceFingerprintStore.fingerprint.fingerprintHash', deviceFingerprintStore.fingerprint.fingerprintHash)
  return (
    <div className="container mx-auto flex flex-col items-center justify-center h-screen p-6 text-center">
      Play
    </div>
  )
})

export default Play
