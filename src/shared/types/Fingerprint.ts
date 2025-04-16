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
  deviceId?: string
  isSaved: boolean;
}
