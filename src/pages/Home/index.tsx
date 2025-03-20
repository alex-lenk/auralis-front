// src/pages/Home
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { Loader } from 'lucide-react'

import { useStore } from '@/stores/StoreContext'
import useDocumentTitle from '@/shared/hooks/useDocumentTitle'
import { Button } from '@/components/ui/Button'

const Home = observer(() => {
  useDocumentTitle('Auralis - где звук встречается с безмятежностью')
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { deviceFingerprintStore } = useStore()
  const [loading, setLoading] = useState(false)

  const handleButtonClick = async () => {
    setLoading(true)
    await deviceFingerprintStore.handleAnonymousRegistration(navigate)
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center grow p-6 text-center">
      <h1 className="mb-5 text-5xl font-bold">Auralis</h1>

      <p
        className="mb-7 text-gray-400 w-2/5 text-lg"
        dangerouslySetInnerHTML={ { __html: t('homePage.subtitle') } }
      />

      <Button
        size="xl"
        className="text-xl"
        variant="default"
        onClick={ handleButtonClick }
        disabled={ loading }
      >
        { t('homePage.textButton') }
        { loading && <Loader className="animate-spin" size={ 24 } /> }
      </Button>
    </div>
  )
})

export default Home
