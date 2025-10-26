import { IFingerprintData } from '@/shared/types/Fingerprint';

const STORAGE_KEY = 'deviceFingerprint';

export const saveFingerprint = async (fingerprint: IFingerprintData): Promise<void> => {
  try {
    const serialized = JSON.stringify(fingerprint);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Ошибка при сохранении fingerprint в localStorage:', error);
  }
};

export const getFingerprint = async (): Promise<IFingerprintData | undefined> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return undefined;
    return JSON.parse(stored);
  } catch (error) {
    console.error('Ошибка при чтении fingerprint из localStorage:', error);
    return undefined;
  }
};
