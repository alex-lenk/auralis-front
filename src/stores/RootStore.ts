import DeviceFingerprintStore from '@/stores/deviceFingerprintStore'

export class RootStore {
  deviceFingerprintStore: DeviceFingerprintStore

  constructor() {
    this.deviceFingerprintStore = new DeviceFingerprintStore(this)
  }
}

const root = new RootStore()

export default root
