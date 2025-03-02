import { makeAutoObservable, runInAction } from 'mobx'

import { RootStore } from '@/stores/RootStore'
import { getFingerprint, saveFingerprint } from '@/shared/lib/indexedDB'
import {
  getOsName,
  getArchitecture,
  getGpuAcceleration,
  getScreenResolution,
  getDevicePixelRatio,
  getCpuCores,
  getGpuDetails,
  getBrowserInfo,
  getLanguageSettings,
  getTimeZone,
  getCanvasFingerprint,
  getWebRTCIPs,
  getBatteryStatus,
  hasTouchScreen,
  getAvailableFonts,
  getPlatformInfo,
  getMediaDevices,
  getWebGLInfo,
  getSupportedCodecs,
  checkAPIs,
  checkSensors,
} from '@/shared/lib/device'

export interface FingerprintData {
  userData: {
    os: string;
    architecture: string;
    gpuAcceleration: string;
    screenResolution: { width: number; height: number };
    devicePixelRatio: number;
    cpuCores: number | string;
    gpuDetails: { renderer: string; vendor: string } | string;
    browserInfo: string;
    languageSettings: { primaryLanguage: string; availableLanguages: readonly string[] };
    timeZone: string;
    canvasFingerprint: string;
    webRTCIPs?: string[];
    batteryStatus?: { level: number; charging: boolean; chargingTime: number; dischargingTime: number } | string;
    touchScreen: boolean;
    availableFonts: string[];
    platformInfo: { platform: string; userAgentData: string | object };
    mediaDevices?: { kind: string; label: string; deviceId: string }[] | string;
    webGLInfo: { version: string; shadingLanguageVersion: string; extensions: string[] } | string;
    supportedCodecs: {
      video: { h264: string; webm: string; ogg: string };
      audio: { mp3: string; ogg: string; wav: string };
    };
    apis: {
      serviceWorker: boolean;
      webAssembly: boolean;
      webGL: boolean;
      webGPU: boolean;
    };
    sensors: {
      accelerometer: boolean;
      gyroscope: boolean;
      magnetometer: boolean;
      orientation: boolean;
    };
  };
  fingerprintHash: string;
}

class DeviceFingerprintStore {
  fingerprint: FingerprintData
  loading: boolean = true

  constructor(protected rootStore: RootStore) {
    makeAutoObservable(this)
    this.fingerprint = this.createEmptyFingerprint()
  }

  private createEmptyFingerprint(): FingerprintData {
    return {
      userData: {
        os: '',
        architecture: '',
        gpuAcceleration: '',
        screenResolution: { width: 0, height: 0 },
        devicePixelRatio: 0,
        cpuCores: 'Неизвестно',
        gpuDetails: '',
        browserInfo: '',
        languageSettings: { primaryLanguage: '', availableLanguages: [] },
        timeZone: '',
        canvasFingerprint: '',
        touchScreen: false,
        availableFonts: [],
        platformInfo: { platform: '', userAgentData: '' },
        webGLInfo: { version: '', shadingLanguageVersion: '', extensions: [] },
        supportedCodecs: {
          video: { h264: '', webm: '', ogg: '' },
          audio: { mp3: '', ogg: '', wav: '' },
        },
        apis: { serviceWorker: false, webAssembly: false, webGL: false, webGPU: false },
        sensors: { accelerometer: false, gyroscope: false, magnetometer: false, orientation: false },
      },
      fingerprintHash: '',
    }
  }

  private sanitizeFingerprint(fingerprint: FingerprintData): FingerprintData {
    return JSON.parse(JSON.stringify(fingerprint))
  }

  async generateFingerprint() {
    runInAction(() => {
      this.loading = true
    })

    const [
      webRTCIPs,
      batteryStatus,
      mediaDevices,
    ] = await Promise.all([
      getWebRTCIPs(),
      getBatteryStatus(),
      getMediaDevices(),
    ])

    const newFingerprint = {
      userData: {
        os: getOsName(),
        architecture: getArchitecture(),
        gpuAcceleration: getGpuAcceleration(),
        screenResolution: getScreenResolution(),
        devicePixelRatio: getDevicePixelRatio(),
        cpuCores: getCpuCores(),
        gpuDetails: getGpuDetails(),
        browserInfo: getBrowserInfo(),
        languageSettings: getLanguageSettings(),
        timeZone: getTimeZone(),
        canvasFingerprint: getCanvasFingerprint(),
        webRTCIPs,
        batteryStatus,
        touchScreen: hasTouchScreen(),
        availableFonts: getAvailableFonts(),
        platformInfo: getPlatformInfo(),
        mediaDevices,
        webGLInfo: getWebGLInfo(),
        supportedCodecs: getSupportedCodecs(),
        apis: checkAPIs(),
        sensors: checkSensors(),
      },
      fingerprintHash: await this.hashFingerprint(),
    }

    await saveFingerprint(this.sanitizeFingerprint(newFingerprint))

    runInAction(() => {
      this.fingerprint = newFingerprint
      this.loading = false
    })
  }

  async loadFingerprint() {
    runInAction(() => {
      this.loading = true
    })

    const existingFingerprint = await getFingerprint()
    if (existingFingerprint) {
      runInAction(() => {
        this.fingerprint = Object.assign(this.createEmptyFingerprint(), existingFingerprint)
      })
    } else {
      await this.generateFingerprint()
    }

    runInAction(() => {
      this.loading = false
    })
  }

  private async hashFingerprint(): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(JSON.stringify(this.fingerprint))
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(hashBuffer)).map(byte => byte.toString(16).padStart(2, '0')).join('')
  }
}

export default DeviceFingerprintStore
