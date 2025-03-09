// src/stores/deviceFingerprintStore.ts
import { makeAutoObservable, runInAction } from 'mobx'
import { NavigateFunction } from 'react-router'

import { RootStore } from '@/stores/RootStore'
import { urlPage } from '@/shared/enum/urlPage'
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

export interface IFingerprintData {
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
  isSaved: boolean;
}

class DeviceFingerprintStore {
  fingerprint: IFingerprintData
  loading: boolean = true
  isFingerprintLoaded: boolean = false

  constructor(protected rootStore: RootStore) {
    makeAutoObservable(this)
    this.fingerprint = this.createEmptyFingerprint()
  }

  // Создаём пустую структуру для fingerprint
  private createEmptyFingerprint(): IFingerprintData {
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
      isSaved: false,
    }
  }

  // Чтобы лишние объекты/методы не попадали в IndexedDB
  private sanitizeFingerprint(fingerprint: IFingerprintData): IFingerprintData {
    return JSON.parse(JSON.stringify(fingerprint))
  }

  // Генерация нового fingerprint, сохранение в IndexedDB (isSaved = false)
  async generateFingerprint() {
    const [
      webRTCIPs,
      batteryStatus,
      mediaDevices,
    ] = await Promise.all([
      getWebRTCIPs(),
      getBatteryStatus(),
      getMediaDevices(),
    ])

    const newFingerprint: IFingerprintData = {
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
      isSaved: false,
    }

    // Сохраняем в IndexedDB с isSaved = false
    await saveFingerprint(this.sanitizeFingerprint(newFingerprint))

    runInAction(() => {
      this.fingerprint = newFingerprint
    })
  }

  // Загрузка fingerprint из IndexedDB, при необходимости создаём новый (createIfMissing)
  async loadFingerprint() {
    this.loading = true
    try {
      const existingFingerprint = await getFingerprint()

      if (existingFingerprint) {
        runInAction(() => {
          this.fingerprint = Object.assign(this.createEmptyFingerprint(), existingFingerprint)
        })
      }
    } catch (error) {
      console.error('Ошибка загрузки отпечатка:', error)
    } finally {
      runInAction(() => {
        this.loading = false
        this.isFingerprintLoaded = true
      })
    }
  }

  async handleAnonymousRegistration(navigate?: NavigateFunction) {
    runInAction(() => {
      this.loading = true
    })

    try {
      let fingerprintData = await getFingerprint()

      // fingerprintHash уже есть
      if (fingerprintData?.fingerprintHash) {
        if (fingerprintData.isSaved) {
          if (navigate) navigate(urlPage.Walkman)
          return
        } else {
          await this.rootStore.authStore.anonymousRegistration(fingerprintData)
          // если успешно, ставим isSaved=true
          fingerprintData.isSaved = true
          await saveFingerprint(this.sanitizeFingerprint(fingerprintData))

          if (navigate) navigate(urlPage.Walkman)
        }
      } else {
        // fingerprintHash нет => генерируем
        await this.generateFingerprint()
        fingerprintData = this.fingerprint

        await this.rootStore.authStore.anonymousRegistration(fingerprintData)
        fingerprintData.isSaved = true
        await saveFingerprint(this.sanitizeFingerprint(fingerprintData))
        if (navigate) navigate(urlPage.Walkman)
      }
    } catch (error) {
      console.error('Ошибка регистрации анонимного пользователя:', error)
    } finally {
      this.loading = false
    }
  }

  // Метод для получения хэша (SHA-256) на основе текущих данных fingerprint
  private async hashFingerprint(): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(JSON.stringify(this.fingerprint))
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(hashBuffer))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('')
  }
}

export default DeviceFingerprintStore
