// src/stores/deviceFingerprintStore.ts

import { makeAutoObservable, runInAction } from 'mobx'
import { NavigateFunction } from 'react-router'
import { AxiosError } from 'axios'

import { RootStore } from '@/stores/RootStore'
import { urlPage } from '@/shared/enum/urlPage'
import { getFingerprint, saveFingerprint } from '@/shared/lib/indexedDB'
import { IFingerprintData } from '@/shared/types/Fingerprint'
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

class DeviceFingerprintStore {
  fingerprint: IFingerprintData
  loading: boolean = true
  isFingerprintLoaded: boolean = false
  error: string | null = null

  constructor(private rootStore: RootStore) {
    makeAutoObservable(this)
    this.fingerprint = this.createEmptyFingerprint()
  }

  // Создаём пустую структуру для fingerprint
  private createEmptyFingerprint(): IFingerprintData {
    return {
      deviceId: '',
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
        webRTCIPs: [],
        batteryStatus: undefined,
        touchScreen: false,
        availableFonts: [],
        platformInfo: { platform: '', userAgentData: '' },
        mediaDevices: [],
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

  // Генерация нового fingerprint, сохранение в IndexedDB (isSaved = false)
  async generateFingerprint() {
    const [webRTCIPs, batteryStatus, mediaDevices, deviceId] = await Promise.all([
      getWebRTCIPs(),
      getBatteryStatus(),
      getMediaDevices(),
      this.getOrCreateDeviceId(),
    ])

    const userData = {
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
    }

    const fingerprintHash = await this.hashFingerprint(userData)

    const newFingerprint: IFingerprintData = {
      deviceId,
      userData,
      fingerprintHash,
      isSaved: false,
    }

    // Сохраняем в IndexedDB с isSaved = false
    await saveFingerprint(newFingerprint)

    runInAction(() => {
      this.fingerprint = newFingerprint
    })
  }

  // Загрузка fingerprint из IndexedDB, при необходимости создаём новый (createIfMissing)
  async loadFingerprint() {
    this.loading = true
    try {
      const existingFingerprint = await getFingerprint()
      runInAction(() => {
        this.fingerprint = existingFingerprint || this.createEmptyFingerprint()
      })
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
      this.error = null
    })

    try {
      // await new Promise((resolve) => setTimeout(resolve, 5000));

      let fingerprintData = await getFingerprint()

      if (fingerprintData?.fingerprintHash) {
        if (fingerprintData.isSaved) {
          navigate?.(urlPage.Walkman)
          return
        } else {
          await this.rootStore.authStore.anonymousRegistration(fingerprintData)

          fingerprintData.isSaved = true

          await saveFingerprint(fingerprintData)

          navigate?.(urlPage.Walkman)
        }
      } else {
        await this.generateFingerprint()

        fingerprintData = this.fingerprint

        await this.rootStore.authStore.anonymousRegistration(fingerprintData)

        fingerprintData.isSaved = true

        await saveFingerprint(fingerprintData)

        navigate?.(urlPage.Walkman)
      }
    } catch (error: unknown) {
      console.error('Ошибка регистрации анонимного пользователя:', error)

      let message = 'Что-то пошло не так. Попробуйте позже.'
      if (error instanceof AxiosError && error.code === 'ERR_NETWORK') {
        message = 'Музыкальный сервис недоступен. Проверьте соединение или попробуйте позже.'
      }

      runInAction(() => {
        this.error = message
      })
    } finally {
      runInAction(() => {
        this.loading = false
      })
    }
  }

  // Метод для получения хэша (SHA-256) на основе текущих данных fingerprint
  private async hashFingerprint(userData: IFingerprintData['userData']): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(JSON.stringify(userData))
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(hashBuffer))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('')
  }

  private async getOrCreateDeviceId(): Promise<string> {
    const existingFingerprint = await getFingerprint()
    if (existingFingerprint?.deviceId) {
      return existingFingerprint.deviceId
    }
    return crypto.randomUUID()
  }

  get getDeviceId() {
    return this.fingerprint.deviceId
  }
}

export default DeviceFingerprintStore
