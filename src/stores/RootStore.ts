import AudioStore from '@/stores/audioStore'
import DeviceFingerprintStore from '@/stores/deviceFingerprintStore'
import LanguageStore from '@/stores/languageStore'

export class RootStore {
  audioStore: AudioStore
  deviceFingerprintStore: DeviceFingerprintStore
  languageStore: LanguageStore

  constructor() {
    this.audioStore = new AudioStore(this)
    this.deviceFingerprintStore = new DeviceFingerprintStore(this)
    this.languageStore = new LanguageStore(this)
  }
}

const root = new RootStore()

export default root
