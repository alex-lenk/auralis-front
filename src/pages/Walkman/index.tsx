import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { observer } from 'mobx-react-lite'
import { Loader } from 'lucide-react'

import { useStore } from '@/stores/StoreContext'
import useDocumentTitle from '@/shared/hooks/useDocumentTitle'
import { urlPage } from '@/shared/enum/urlPage'
import Player from '@/modules/Player'

const Walkman = observer(() => {
  const { deviceFingerprintStore, audioStore } = useStore()
  const navigate = useNavigate()

  useDocumentTitle('Play: Focus - Auralis: где звук встречается с безмятежностью')

  useEffect(() => {
    const checkFingerprint = async () => {
      if (!deviceFingerprintStore.fingerprint.fingerprintHash) {
        await deviceFingerprintStore.loadFingerprint()
      }

      if (!deviceFingerprintStore.fingerprint.fingerprintHash) {
        navigate(urlPage.Index)
      } else {
        await audioStore.initialize()
      }
    }

    checkFingerprint()
  }, [deviceFingerprintStore, navigate, audioStore])

  if (deviceFingerprintStore.loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin" size={ 48 } />
      </div>
    )
  }

  return (
    <div className="container mx-auto mt-auto flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Focus</h1>
        <p className="text-sm text-gray-500">Your ID: { deviceFingerprintStore.fingerprint.fingerprintHash }</p>
      </div>

      <Player />
    </div>
  )
})

export default Walkman
