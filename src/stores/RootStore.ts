import DeviceFingerprintStore from '@/stores/deviceFingerprintStore'
import LanguageStore from '@/stores/languageStore'

export class RootStore {
  deviceFingerprintStore: DeviceFingerprintStore
  languageStore: LanguageStore

  constructor() {
    this.deviceFingerprintStore = new DeviceFingerprintStore(this)
    this.languageStore = new LanguageStore(this)
  }
}

const root = new RootStore()

export default root
