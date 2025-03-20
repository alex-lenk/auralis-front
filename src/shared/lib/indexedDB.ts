// src/shared/lib/indexedDB.ts
import { openDB } from 'idb'

import { IFingerprintData } from '@/stores/deviceFingerprintStore'

const DB_NAME = 'deviceFingerprintDB'
const STORE_NAME = 'fingerprint'

export const initDB = async () => {
  return await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
};

export const saveFingerprint = async (fingerprint: IFingerprintData) => {
  const sanitized = JSON.parse(JSON.stringify(fingerprint));
  const db = await initDB();
  await db.put(STORE_NAME, sanitized, 'deviceFingerprint');
};

export const getFingerprint = async (): Promise<IFingerprintData | undefined> => {
  const db = await initDB();
  return await db.get(STORE_NAME, 'deviceFingerprint');
};
