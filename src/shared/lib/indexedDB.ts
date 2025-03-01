// src/shared/lib/indexedDB.ts
import { openDB } from 'idb'

import { FingerprintData } from '@/stores/deviceFingerprintStore'

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

export const saveFingerprint = async (fingerprint: FingerprintData) => {
  const db = await initDB();
  await db.put(STORE_NAME, fingerprint, 'deviceFingerprint');
};

export const getFingerprint = async (): Promise<FingerprintData | undefined> => {
  const db = await initDB();
  return await db.get(STORE_NAME, 'deviceFingerprint');
};
