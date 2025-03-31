// src/stores/RootStore.ts
import { makeObservable } from 'mobx'
import AudioStore from '@/stores/audioStore'
import AuthStore from '@/stores/Auth/AuthStore'
import DeviceFingerprintStore from '@/stores/deviceFingerprintStore'
import LanguageStore from '@/stores/languageStore'
import ThemeToggleStore from '@/stores/themeToggleStore'

export class RootStore {
  audioStore: AudioStore
  authStore: AuthStore
  deviceFingerprintStore: DeviceFingerprintStore
  languageStore: LanguageStore
  themeToggleStore: ThemeToggleStore

  constructor() {
    this.deviceFingerprintStore = new DeviceFingerprintStore(this)
    this.authStore = new AuthStore(this)
    this.audioStore = new AudioStore(this)
    this.languageStore = new LanguageStore(this)
    this.themeToggleStore = new ThemeToggleStore(this)

    makeObservable(this, {
      audioStore: true,
      authStore: true,
      deviceFingerprintStore: true,
      languageStore: true,
      themeToggleStore: true,
    })
  }
}

const root = new RootStore()

export default root
