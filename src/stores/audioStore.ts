import { makeAutoObservable } from 'mobx'
import Hls from 'hls.js'
import { RootStore } from '@/stores/RootStore'
import api from '@/stores/Auth/Api'
import { musicMode } from '@/shared/enum/playlist'

class AudioStore {
  isPlaying = false
  volume = 50
  isMuted = false
  mode: musicMode = musicMode.Focus
  hls: Hls | null = null
  audio = new Audio()
  fingerprint = this.rootStore.deviceFingerprintStore.getFingerprint

  constructor(private rootStore: RootStore) {
    makeAutoObservable(this)

    this.audio.volume = this.volume / 100
    this.initHLS()

    this.loadFingerprint()
  }

  async initHLS() {
    if (!Hls.isSupported()) {
      console.error('HLS не поддерживается в этом браузере')
      return
    }

    this.hls = new Hls()

    this.hls.attachMedia(this.audio)
    this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
      console.log('HLS Manifest загружен')
      // НЕ автозапускаем, ждем вызова togglePlay()
    })
  }

  getPlaylistUrl(): string {
    if (!this.fingerprint) {
      console.error('Fingerprint отсутствует, запрос невозможен')
      return ''
    }

    return api.getUri({
      url: `/playlist/${ this.mode }.m3u8`,
      params: {
        hour: new Date().getHours(),
        fingerprint: this.fingerprint,
      },
    })
  }

  updatePlaylist() {
    if (!this.hls) return

    console.log('Обновление плейлиста:', this.getPlaylistUrl())
    this.hls.loadSource(this.getPlaylistUrl())
  }

  togglePlay() {
    if (!this.hls) return

    if (!this.isPlaying) {
      this.updatePlaylist()
      this.audio.play().catch(err => console.error('Ошибка воспроизведения:', err))
    } else {
      this.audio.pause()
    }

    this.isPlaying = !this.isPlaying
  }

  setVolume(volume: number) {
    this.volume = volume
    this.audio.volume = this.isMuted ? 0 : volume / 100
  }

  toggleMute() {
    this.isMuted = !this.isMuted
    this.audio.volume = this.isMuted ? 0 : this.volume / 100
  }

  setMode(mode: musicMode) {
    if (this.mode !== mode) {
      this.mode = mode
      this.updatePlaylist()
    }
  }

  private async loadFingerprint() {
    await this.rootStore.deviceFingerprintStore.loadFingerprint()
    this.fingerprint = this.rootStore.deviceFingerprintStore.fingerprint.fingerprintHash

    if (!this.fingerprint) {
      console.error('Ошибка: fingerprint не загружен')
    }
  }
}

export default AudioStore
