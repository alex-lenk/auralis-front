import { observer } from 'mobx-react-lite'
import { Moon, Sun } from 'lucide-react'

import useStore from '@/stores/StoreContext'
import { Button } from '@/components/ui/Button'

const ThemeToggle = observer(() => {
  const { themeToggleStore } = useStore()

  return (
    <Button variant="secondary" onClick={() => themeToggleStore.toggleTheme()}>
      {themeToggleStore.theme === 'dark' ? (
        <Sun className="rotateSpin h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  )
})

export default ThemeToggle
