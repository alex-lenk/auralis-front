export const getOsName = () => {
  const ua = navigator.userAgent
  if (ua.includes('Windows NT 10.0')) return 'Windows 10'
  if (ua.includes('Windows NT 11.0')) return 'Windows 11'
  if (ua.includes('Mac OS X')) return 'macOS'
  if (ua.includes('Linux')) return 'Linux'
  return 'Неизвестно'
}

export const getArchitecture = () => {
  if (navigator.userAgent.includes('Win64') || navigator.userAgent.includes('x86_64')) return 'x86 64'
  if (navigator.userAgent.includes('WOW64')) return 'x86 32 (WOW64)'
  return 'Неизвестно'
}

export const getGpuAcceleration = () => {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    return gl ? '✓' : '✗'
  } catch {
    return '✗'
  }
}

export const checkPermissions = async () => {
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
      const status = await navigator.permissions.query({name: name as PermissionName})
      results[name] = status.state
    } catch {
      results[name] = 'Не поддерживается'
    }
  }
  return results
}

// Аппаратные характеристики
export const getScreenResolution = () => {
  return {
    width: window.screen.width,
    height: window.screen.height
  };
};

export const getDevicePixelRatio = () => {
  return window.devicePixelRatio;
};

export const getCpuCores = () => {
  return navigator.hardwareConcurrency || 'Неизвестно';
};

/*
@todo безполезное
export const getDeviceMemory = () => {
  return navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'Неизвестно';
};
*/

export const getGpuDetails = () => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') as WebGLRenderingContext | null;
    if (!gl) return 'Графический рендеринг не поддерживается';
    return {
      renderer: gl.getParameter(gl.RENDERER),
      vendor: gl.getParameter(gl.VENDOR)
    };
  } catch {
    return 'Не удалось получить данные';
  }
};

// Программные характеристики
export const getBrowserInfo = () => {
  return navigator.userAgent;
};

export const getLanguageSettings = () => {
  return {
    primaryLanguage: navigator.language,
    availableLanguages: navigator.languages
  };
};

/*
@todo безполезное
export const getInstalledFonts = async () => {
  if (!('queryLocalFonts' in navigator)) return 'Не поддерживается';
  try {
    const fonts = await navigator.queryLocalFonts();
    return fonts.map(font => font.family);
  } catch {
    return 'Ошибка при получении шрифтов';
  }
};

export const getBrowserPlugins = () => {
  return Array.from(navigator.plugins).map(plugin => plugin.name);
};
*/


export const getTimeZone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

// Сетевые параметры
export const getGeolocation = async () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject('Геолокация не поддерживается');
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => reject(error.message)
    );
  });
};

// Уникальные параметры
export const getCanvasFingerprint = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return 'Не поддерживается';
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillText('Canvas Fingerprint Test', 2, 2);
  return canvas.toDataURL();
};
