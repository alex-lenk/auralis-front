import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { themeSelect, useTheme } from '@/hooks/useTheme'
import { Button } from '@/components/ui/Button'

export function ThemeToggle() {
  const {theme, setTheme} = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-10 h-10" /> // Заглушка для SSR
  }

  return (
    <Button
      variant="secondary"
      onClick={() => setTheme(theme === themeSelect.dark ? themeSelect.light : themeSelect.dark)}
    >
      {theme === themeSelect.dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  )
}
