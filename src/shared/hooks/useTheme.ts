'use client'

import { useEffect, useState } from 'react'

export enum themeSelect {
  dark = 'dark',
  light = 'light',
}

export function useTheme() {
  const [theme, setTheme] = useState<themeSelect.light | themeSelect.dark>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === themeSelect.light ? themeSelect.light : themeSelect.dark
    }
    return themeSelect.dark
  })

  useEffect(() => {
    if (theme === themeSelect.light) {
      document.documentElement.classList.add(themeSelect.light)
    } else {
      document.documentElement.classList.remove(themeSelect.light)
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  return { theme, setTheme }
}
