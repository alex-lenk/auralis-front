import { observer } from 'mobx-react-lite'
import { Globe } from 'lucide-react'

import { useStore } from '@/stores/StoreContext'
import { Button } from '@/components/ui/Button'

const LanguageSwitcher = observer(() => {
  const { languageStore } = useStore()

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className="flex items-center cursor-pointer"
        onClick={ () => languageStore.toggleMenu() }
      >
        <Globe className="h-5 w-5" absoluteStrokeWidth />
      </Button>

      { languageStore.isOpen && (
        <div className="absolute top-10 left-0 border border-gray-400 rounded-lg shadow-lg w-40 overflow-hidden">
          { languageStore.languages.map(({ code, label }) => (
            <button
              key={ code }
              className={ `w-full text-left px-4 py-2 ${
                languageStore.language === code ? 'bg-blue-500 text-white' : 'hover:bg-blue-400'
              }` }
              onClick={ () => languageStore.setLanguage(code) }
              disabled={ languageStore.language === code }
            >
              { label }
            </button>
          )) }
        </div>
      ) }
    </div>
  )
})

export default LanguageSwitcher
