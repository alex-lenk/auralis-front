import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <div className="flex gap-2">
      <button onClick={ () => changeLanguage('ru') }>Русский</button>
      <button onClick={ () => changeLanguage('en') }>English</button>
      <button onClick={ () => changeLanguage('es') }>Español</button>
    </div>
  )
}
