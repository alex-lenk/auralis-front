import { makeAutoObservable } from 'mobx'

import { RootStore } from '@/stores/RootStore'

export enum Theme {
  Dark = 'dark',
  Light = 'light',
}

class ThemeToggleStore {
  theme: Theme = Theme.Dark

  constructor(protected rootStore: RootStore) {
    makeAutoObservable(this)

    const storedTheme = localStorage.getItem('theme') as Theme | null
    if (storedTheme === Theme.Light) {
      this.theme = Theme.Light
      document.documentElement.classList.remove('dark')
    }
  }

  toggleTheme() {
    this.theme = this.theme === Theme.Dark ? Theme.Light : Theme.Dark
    localStorage.setItem('theme', this.theme)
    if (this.theme === Theme.Light) {
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
    }
  }
}

export default ThemeToggleStore
