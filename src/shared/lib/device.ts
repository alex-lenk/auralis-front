/**
 * Возвращает название операционной системы на основе userAgent.
 */
export const getOsName = (): string => {
  const ua = navigator.userAgent
  if (ua.includes('Windows NT 10.0')) return 'Windows 10'
  if (ua.includes('Windows NT 11.0')) return 'Windows 11'
  if (ua.includes('Mac OS X')) return 'macOS'
  if (ua.includes('Linux')) return 'Linux'
  return 'Неизвестно'
}

/**
 * Возвращает архитектуру процессора на основе userAgent.
 */
export const getArchitecture = (): string => {
  if (navigator.userAgent.includes('Win64') || navigator.userAgent.includes('x86_64')) return 'x86 64'
  if (navigator.userAgent.includes('WOW64')) return 'x86 32 (WOW64)'
  return 'Неизвестно'
}

/**
 * Проверяет, поддерживается ли GPU-ускорение.
 * @returns "✓" если поддерживается, "✗" если нет.
 */
export const getGpuAcceleration = (): string => {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    return gl ? '✓' : '✗'
  } catch {
    return '✗'
  }
}

/**
 * Проверяет статус разрешений для различных API.
 */
export const checkPermissions = async (): Promise<Record<string, string>> => {
  const permissionsList = [
    'accelerometer',
    'background-sync',
    'camera',
    'clipboard-read',
    'clipboard-write',
    'display-capture',
    'geolocation',
    'gyroscope',
    'idle-detection',
    'local-fonts',
    'magnetometer',
    'microphone',
    'midi',
    'notifications',
    'persistent-storage',
    'push',
    'screen-wake-lock',
    'storage-access',
    'window-management',
  ]
  const results: Record<string, string> = {}

  for (const name of permissionsList) {
    try {
      const status = await navigator.permissions.query({ name: name as PermissionName })
      results[name] = status.state
    } catch {
      results[name] = 'Не поддерживается'
    }
  }
  return results
}

/**
 * Возвращает разрешение экрана устройства.
 */
export const getScreenResolution = (): { width: number; height: number } => {
  return {
    width: window.screen.width,
    height: window.screen.height,
  }
}

/**
 * Возвращает плотность пикселей устройства.
 */
export const getDevicePixelRatio = (): number => {
  return window.devicePixelRatio
}

/**
 * Возвращает количество ядер процессора.
 */
export const getCpuCores = (): number | string => {
  return navigator.hardwareConcurrency || 'Неизвестно'
}

/**
 * Возвращает информацию о GPU.
 */
export const getGpuDetails = (): { renderer: string; vendor: string } | string => {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') as WebGLRenderingContext | null
    if (!gl) return 'Графический рендеринг не поддерживается'
    return {
      renderer: gl.getParameter(gl.RENDERER),
      vendor: gl.getParameter(gl.VENDOR),
    }
  } catch {
    return 'Не удалось получить данные'
  }
}

/**
 * Возвращает информацию о браузере из userAgent.
 */
export const getBrowserInfo = (): string => {
  return navigator.userAgent
}

/**
 * Возвращает языковые настройки браузера.
 */
export const getLanguageSettings = (): { primaryLanguage: string; availableLanguages: readonly string[] } => {
  return {
    primaryLanguage: navigator.language,
    availableLanguages: navigator.languages,
  }
}

/**
 * Возвращает временную зону устройства.
 */
export const getTimeZone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

/**
 * Возвращает геолокацию устройства. @todo не используется, удалить 01.06.2025
 */
export const getGeolocation = async (): Promise<{ latitude: number; longitude: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject('Геолокация не поддерживается')
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (error) => reject(error.message),
    )
  })
}

/**
 * Создает уникальный отпечаток Canvas.
 */
export const getCanvasFingerprint = (): string => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return 'Не поддерживается'
  ctx.textBaseline = 'top'
  ctx.font = '14px Arial'
  ctx.fillText('Canvas Fingerprint Test', 2, 2)
  return canvas.toDataURL()
}

/**
 * Безопасное получение IP-адресов через WebRTC.
 * Возвращает ['0.0.0.0'] при ошибке или таймауте.
 */
export const getWebRTCIPs = async (): Promise<string[]> => {
  return new Promise((resolve) => {
    const ips = new Set<string>()
    let isResolved = false

    try {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      })

      pc.createDataChannel('dummy')

      pc.onicecandidate = (event) => {
        if (!event.candidate && !isResolved) {
          isResolved = true
          pc.close()
          resolve(ips.size ? [...ips] : ['0.0.0.0'])
        }

        const ipRegex = /([0-9]{1,3}(?:\.[0-9]{1,3}){3})|([a-f0-9:]+:+[a-f0-9]+)/i
        const match = event?.candidate?.candidate?.match(ipRegex)
        if (match) {
          const ip = match[1] || match[2]
          if (ip) ips.add(ip)
        }
      }

      // fallback через 2 секунды (таймаут)
      setTimeout(() => {
        if (!isResolved) {
          isResolved = true
          pc.close()
          resolve(ips.size ? [...ips] : ['0.0.0.0'])
        }
      }, 2000)

      pc.createOffer()
        .then(offer => pc.setLocalDescription(offer))
        .catch(() => {
          if (!isResolved) {
            isResolved = true
            pc.close()
            resolve(['0.0.0.0'])
          }
        })
    } catch {
      resolve(['0.0.0.0'])
    }
  })
}

interface NavigatorWithBattery extends Navigator {
  getBattery: () => Promise<BatteryManager>;
}

/**
 * Возвращает статус батареи устройства.
 */
export const getBatteryStatus = async (): Promise<
  { level: number; charging: boolean; chargingTime: number; dischargingTime: number } | string
> => {
  if (!('getBattery' in navigator)) return 'Не поддерживается'
  try {
    const battery = await (navigator as NavigatorWithBattery).getBattery()
    return {
      level: battery.level,
      charging: battery.charging,
      chargingTime: battery.chargingTime,
      dischargingTime: battery.dischargingTime,
    }
  } catch {
    return 'Ошибка при получении данных о батарее'
  }
}

/**
 * Проверяет, есть ли у устройства сенсорный экран.
 */
export const hasTouchScreen = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

/**
 * Возвращает список доступных шрифтов.
 */
export const getAvailableFonts = (): string[] => {
  const fonts = new Set<string>()
  document.fonts.forEach((font) => fonts.add(font.family))
  return Array.from(fonts)
}

interface UserAgentData {
  platform: string;
  brands: { brand: string; version: string }[];
  mobile: boolean;
}

interface NavigatorWithUserAgentData extends Navigator {
  userAgentData?: UserAgentData;
}

/**
 * Возвращает информацию о платформе и устройстве.
 */
export const getPlatformInfo = (): { platform: string; userAgentData: UserAgentData | string } => {
  const navigatorWithData = navigator as NavigatorWithUserAgentData
  return {
    platform: navigatorWithData.userAgentData?.platform || navigator.platform,
    userAgentData: navigatorWithData.userAgentData || 'Не поддерживается',
  }
}

/**
 * Возвращает список доступных медиа-устройств.
 */
export const getMediaDevices = async (): Promise<
  { kind: string; label: string; deviceId: string }[] | string
> => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices()
    return devices.map((device) => ({
      kind: device.kind,
      label: device.label,
      deviceId: device.deviceId,
    }))
  } catch {
    return 'Ошибка при получении медиа-устройств'
  }
}

/**
 * Возвращает информацию о WebGL.
 */
export const getWebGLInfo = (): { version: string; shadingLanguageVersion: string; extensions: string[] } | string => {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') as WebGLRenderingContext | null
    if (!gl) return 'WebGL не поддерживается'
    return {
      version: gl.getParameter(gl.VERSION),
      shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
      extensions: gl.getSupportedExtensions() || [],
    }
  } catch {
    return 'Ошибка при получении информации о WebGL'
  }
}

/**
 * Проверяет поддерживаемые аудио и видео кодеки.
 */
export const getSupportedCodecs = (): {
  video: { h264: string; webm: string; ogg: string };
  audio: { mp3: string; ogg: string; wav: string };
} => {
  const video = document.createElement('video')
  const audio = document.createElement('audio')
  return {
    video: {
      h264: video.canPlayType('video/mp4; codecs="avc1.42E01E"'),
      webm: video.canPlayType('video/webm; codecs="vp8, vorbis"'),
      ogg: video.canPlayType('video/ogg; codecs="theora, vorbis"'),
    },
    audio: {
      mp3: audio.canPlayType('audio/mpeg'),
      ogg: audio.canPlayType('audio/ogg; codecs="vorbis"'),
      wav: audio.canPlayType('audio/wav; codecs="1"'),
    },
  }
}

/**
 * Проверяет наличие различных API.
 */
export const checkAPIs = (): {
  serviceWorker: boolean;
  webAssembly: boolean;
  webGL: boolean;
  webGPU: boolean;
} => {
  return {
    serviceWorker: 'serviceWorker' in navigator,
    webAssembly: 'WebAssembly' in window,
    webGL: 'WebGLRenderingContext' in window,
    webGPU: 'gpu' in navigator,
  }
}

/**
 * Проверяет наличие различных сенсоров.
 */
export const checkSensors = (): {
  accelerometer: boolean;
  gyroscope: boolean;
  magnetometer: boolean;
  orientation: boolean;
} => {
  return {
    accelerometer: 'Accelerometer' in window,
    gyroscope: 'Gyroscope' in window,
    magnetometer: 'Magnetometer' in window,
    orientation: 'DeviceOrientationEvent' in window,
  }
}
