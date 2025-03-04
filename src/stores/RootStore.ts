import AudioStore from '@/stores/audioStore'
import DeviceFingerprintStore from '@/stores/deviceFingerprintStore'
import LanguageStore from '@/stores/languageStore'
import ThemeToggleStore from '@/stores/themeToggleStore'

export class RootStore {
  audioStore: AudioStore
  deviceFingerprintStore: DeviceFingerprintStore
  languageStore: LanguageStore
  themeToggleStore: ThemeToggleStore

  constructor() {
    this.audioStore = new AudioStore(this)
    this.deviceFingerprintStore = new DeviceFingerprintStore(this)
    this.languageStore = new LanguageStore(this)
    this.themeToggleStore = new ThemeToggleStore(this)
  }
}

const root = new RootStore()

export default root
