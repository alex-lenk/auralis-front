import { useTranslation } from 'react-i18next'

import useDocumentTitle from '@/shared/hooks/useDocumentTitle'
import { Button } from '@/components/ui/Button'
import { urlPage } from '@/shared/enum/urlPage'

const Home = () => {
  useDocumentTitle('Auralis - где звук встречается с безмятежностью');
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center h-screen p-6 text-center">
      <h1 className="mb-5 text-5xl font-bold">Auralis</h1>

      <p
        className="mb-7 text-gray-500 w-2/5 text-lg"
        dangerouslySetInnerHTML={ { __html: t('homePage.subtitle') } }
      />

      <Button size="xl" className="text-xl" variant="default" href={ urlPage.Walkman }>
        { t('homePage.textButton') }
      </Button>
    </div>
  )
}

export default Home
