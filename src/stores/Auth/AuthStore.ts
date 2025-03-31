// src/stores/Auth/AuthStore.ts
import { makeAutoObservable, runInAction } from 'mobx'

import api from '@/stores/Auth/Api'
import { RootStore } from '@/stores/RootStore'
import { IFingerprintData } from '@/shared/types/Fingerprint'

class AuthStore {
  loading: boolean = false

  constructor(protected rootStore: RootStore) {
    makeAutoObservable(this)
  }

  // Отправка анонимного пользователя на сервер
  async anonymousRegistration(fingerprintData: IFingerprintData) {
    this.loading = true

    try {
      const payload = {
        fingerprint: fingerprintData.fingerprintHash,
        userData: fingerprintData.userData,
      }

      const response = await api.post('/auth/anonymous', payload)

      if (response.status === 204) {
        runInAction(() => {
          fingerprintData.isSaved = true
        })
      }
    } catch (error) {
      console.error('Ошибка регистрации анонимного пользователя:', error)
      throw error
    } finally {
      this.loading = false
    }
  }
}

export default AuthStore
