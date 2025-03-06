import { useEffect, useState } from 'react'
import { NavLink } from 'react-router'

import { Button } from '@/components/ui/Button'
import { urlPage } from '@/shared/enum/urlPage.ts'

const StorageConsent = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const hasConsented = localStorage.getItem('storageConsent')
    if (!hasConsented) {
      setIsVisible(true)
    }
  }, [])

  const handleClose = () => {
    localStorage.setItem('storageConsent', 'true')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-3 flex items-center justify-between z-50">
      <div className="text-sm">
        Использую современные технологии, чтобы сайт был удобен для вас.
        <NavLink to={ urlPage.Policy } className="ms-2 text-blue-400 hover:underline">
          Подробнее
        </NavLink>
      </div>
      <Button
        onClick={ handleClose }
        className="bg-transparent hover:bg-gray-700 text-white border border-white"
      >
        Закрыть
      </Button>
    </div>
  )
}

export default StorageConsent
