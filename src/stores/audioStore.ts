// src/stores/audioStore.ts

import { makeAutoObservable } from 'mobx'
import Hls from 'hls.js'
import { RootStore } from '@/stores/RootStore'
import api from '@/stores/Auth/Api'
import { musicMode } from '@/shared/enum/playlist'

// 1440 аудиофайлов, по 60 сек
const TOTAL_SEGMENTS = 1440
const SEGMENTS_PER_PLAYLIST = 60

class AudioStore {
  isPlaying = false
  volume = 75
  isMuted = false
  mode: musicMode = musicMode.Focus
  fingerprint: string | null = null
  startSegment = 0  // Хранит, с какого сегмента сейчас берём плейлист
  hls: Hls | null = null
  audio = new Audio()
  isInitialized = false
  error: string | null = null

  // Отслеживает, загрузили ли мы хотя бы один раз плейлист
  private isPlaylistLoaded = false

  private refreshTimer: ReturnType<typeof setTimeout> | null = null

  constructor(private rootStore: RootStore) {
    makeAutoObservable(this)
  }

  // Инициализация: (1) Audio.volume (2) Hls.js (3) fingerprint
  async initialize() {
    if (this.isInitialized) return

    try {
      // начальные настройки громкости
      this.audio.volume = this.volume / 100

      // инициализируем HLS
      await this.initHLS()

      // грузим fingerprint устройства
      await this.loadFingerprint()

      this.isInitialized = true
    } catch (error) {
      this.setError('Не удалось инициализировать аудиоплеер')
      throw error
    }
  }

  // Настраиваем HLS
  async initHLS() {
    if (!Hls.isSupported()) {
      console.error('HLS не поддерживается в этом браузере')
      return
    }

    this.hls = new Hls()

    // Привязываем hls к объекту
    this.hls.attachMedia(this.audio)

    // Ждём, когда будет готов манифест
    this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
      console.log('MANIFEST_PARSED: манифест загружен')
      // Не автозапускаем. Ждём togglePlay().
    })

    // Ловим возможные ошибки
    this.hls.on(Hls.Events.ERROR, (_event, data) => {
      console.error('HLS error:', data)
    })
  }

  // Генерируем URL
  getPlaylistUrl(): string {
    if (!this.fingerprint) {
      console.error('Нет fingerprint, не можем получить плейлист')
      return ''
    }

    // Пример: /playlist/focus.m3u8?hour=...&fingerprint=...
    return api.getUri({
      url: `/playlist/${ this.mode }.m3u8`,
      params: {
        start: this.startSegment,
        fingerprint: this.fingerprint,
      },
    })
  }

  // Вызываем, чтобы загрузить .m3u8 и привязать к audio
  updatePlaylist() {
    if (!this.hls) {
      console.error('HLS не инициализирован')
      return
    }

    const playlistUrl = this.getPlaylistUrl()
    if (!playlistUrl) return

    // Загружаем новый source
    this.hls.loadSource(playlistUrl)
    this.isPlaylistLoaded = true
  }

  /**
   * togglePlay:
   * 1) Если мы ещё не загрузили плейлист (isPlaylistLoaded=false), то загружаем (updatePlaylist).
   * 2) Если уже загружен, просто play/pause — без повторного запроса.
   */
  togglePlay() {
    if (!this.isInitialized || !this.hls) {
      console.warn('Плеер не инициализирован')
      return
    }

    // Если нажали Play
    if (!this.isPlaying) {
      // Если плейлист не подгружен (или сбросился при смене режима), то грузим
      if (!this.isPlaylistLoaded) {
        this.updatePlaylist()
      }
      this.audio.play().catch(err => console.error('Ошибка Play:', err))
      this.scheduleAutoRefresh()
    } else {
      // Иначе - ставим паузу
      this.audio.pause()
      this.clearAutoRefresh() // убираем таймер
    }

    this.isPlaying = !this.isPlaying
  }

  /**
   * "Обновить список" / переход на следующий сегмент:
   * 1) Сдвигаем startSegment
   * 2) Сбрасываем isPlaylistLoaded
   * 3) Перезапрашиваем плейлист, если сейчас isPlaying=true (чтобы сразу продолжилось)
   */
  nextSegment() {
    if (!this.hls) {
      console.warn('HLS не инициализирован')
      return
    }
    this.startSegment = (this.startSegment + SEGMENTS_PER_PLAYLIST) % TOTAL_SEGMENTS
    this.isPlaylistLoaded = false

    console.log(`Обновили список: startSegment=${ this.startSegment }`)

    // Загружаем новый блок
    if (this.isPlaying) {
      this.updatePlaylist()
      this.audio.play().catch(err => console.error('Ошибка play:', err))
      this.scheduleAutoRefresh()
    }
  }

  // Запускаем таймер, который через 59 мин автоматически сдвигает nextSegment
  scheduleAutoRefresh() {
    this.clearAutoRefresh()
    // 59 мин * 60 000 мс
    this.refreshTimer = setTimeout(() => {
      // Если всё ещё играем – подгружаем следующий час
      if (this.isPlaying) {
        // загружаем следующий час
        this.nextSegment()
      }
    }, 59 * 60_000)
  }

  // Сброс таймера
  clearAutoRefresh() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer)
      this.refreshTimer = null
    }
  }

  /**
   * Смена режима (focus, relax и тд).
   * 1) сбрасываем startSegment=0
   * 2) сбрасываем isPlaylistLoaded, чтобы togglePlay() заново грузил
   * 3) если музыка играет, вызываем updatePlaylist + play
   */
  setMode(mode: musicMode) {
    if (this.mode !== mode) {
      this.mode = mode
      this.startSegment = 0
      this.isPlaylistLoaded = false

      if (this.isPlaying) {
        // При смене режима пересобираем новый плейлист
        this.updatePlaylist()
        // Оставляем play
        this.audio.play().catch(err => console.error('Play error:', err))
        this.scheduleAutoRefresh()
      }
    }
  }

  // Громкость
  setVolume(volume: number) {
    this.volume = volume
    this.audio.volume = this.isMuted ? 0 : volume / 100
  }

  // Mute
  toggleMute() {
    this.isMuted = !this.isMuted
    this.audio.volume = this.isMuted ? 0 : this.volume / 100
  }

  private async loadFingerprint() {
    await this.rootStore.deviceFingerprintStore.loadFingerprint()
    this.fingerprint = this.rootStore.deviceFingerprintStore.getFingerprint

    if (!this.fingerprint) {
      console.error('Ошибка: fingerprint не загружен')
    }
  }

  private setError(message: string) {
    this.error = message
    setTimeout(() => this.error = null, 5000) // Автоматическое очищение через 5 сек
  }
}

export default AudioStore
