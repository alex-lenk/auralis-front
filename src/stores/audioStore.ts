import { makeAutoObservable } from 'mobx';
import Hls from 'hls.js';
import { RootStore } from '@/stores/RootStore';
import api from '@/stores/Auth/Api';
import { musicMode } from '@/shared/enum/playlist';

const TOTAL_SEGMENTS = 1440;
const SEGMENTS_PER_PLAYLIST = 60;

class AudioStore {
  isPlaying = false;
  volume = 75;
  isMuted = false;
  mode: musicMode = musicMode.Focus;
  deviceId: string | null = null;
  startSegment = 0;
  hls: Hls | null = null;
  audio = new Audio();
  isInitialized = false;
  error: string | null = null;
  audioCtx: AudioContext | null = null;
  analyser: AnalyserNode | null = null;

  private sourceNode: MediaElementAudioSourceNode | null = null;

  private isPlaylistLoaded = false;

  private refreshTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private rootStore: RootStore) {
    makeAutoObservable(this);
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      this.audio.volume = this.volume / 100;

      await this.initHLS();

      this.initAudioAnalysis();

      await this.loadFingerprint();

      this.isInitialized = true;
    } catch (error) {
      this.setError('Не удалось инициализировать аудиоплеер');
      throw error;
    }
  }

  initAudioAnalysis() {
    if (this.audioCtx || this.analyser || this.sourceNode) return;

    this.audioCtx = new AudioContext();
    this.analyser = this.audioCtx.createAnalyser();
    this.sourceNode = this.audioCtx.createMediaElementSource(this.audio);

    this.sourceNode.connect(this.analyser);
    this.analyser.connect(this.audioCtx.destination);
    this.analyser.fftSize = 256;
  }

  async initHLS() {
    if (!Hls.isSupported()) {
      console.error('HLS не поддерживается в этом браузере');
      return;
    }

    this.hls = new Hls();

    this.hls.attachMedia(this.audio);

    this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
      // Не автозапускаем. Ждём togglePlay().
    });

    this.hls.on(Hls.Events.ERROR, (_event, data) => {
      console.error('HLS error:', data);
    });
  }

  getPlaylistUrl(): string {
    if (!this.deviceId) {
      console.error('Нет deviceId, не можем получить плейлист');
      return '';
    }

    return api.getUri({
      url: `/playlist/${this.mode}.m3u8`,
      params: {
        start: this.startSegment,
        deviceId: this.deviceId,
      },
    });
  }

  updatePlaylist() {
    if (!this.hls) {
      console.error('HLS не инициализирован');
      return;
    }

    const playlistUrl = this.getPlaylistUrl();
    if (!playlistUrl) return;

    this.hls.loadSource(playlistUrl);
    this.isPlaylistLoaded = true;
  }

  /**
   * togglePlay:
   * 1) Если мы ещё не загрузили плейлист (isPlaylistLoaded=false), то загружаем (updatePlaylist).
   * 2) Если уже загружен, просто play/pause — без повторного запроса.
   */
  togglePlay() {
    if (!this.isInitialized || !this.hls) {
      console.warn('Плеер не инициализирован');
      return;
    }

    if (!this.isPlaying) {
      if (!this.isPlaylistLoaded) {
        this.updatePlaylist();
      }
      this.audio.play().catch(err => console.error('Ошибка Play:', err));
      this.scheduleAutoRefresh();
    } else {
      this.audio.pause();
      this.clearAutoRefresh();
    }

    this.isPlaying = !this.isPlaying;
  }

  /**
   * "Обновить список" / переход на следующий сегмент:
   * 1) Сдвигаем startSegment
   * 2) Сбрасываем isPlaylistLoaded
   * 3) Перезапрашиваем плейлист, если сейчас isPlaying=true (чтобы сразу продолжилось)
   */
  nextSegment() {
    if (!this.hls) {
      console.warn('HLS не инициализирован');
      return;
    }
    this.startSegment = (this.startSegment + SEGMENTS_PER_PLAYLIST) % TOTAL_SEGMENTS;
    this.isPlaylistLoaded = false;

    if (this.isPlaying) {
      this.updatePlaylist();
      this.audio.play().catch(err => console.error('Ошибка play:', err));
      this.scheduleAutoRefresh();
    }
  }

  scheduleAutoRefresh() {
    this.clearAutoRefresh();
    this.refreshTimer = setTimeout(() => {
      if (this.isPlaying) {
        this.nextSegment();
      }
    }, 59 * 60_000);
  }

  clearAutoRefresh() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
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
      this.mode = mode;
      this.startSegment = 0;
      this.isPlaylistLoaded = false;

      if (this.isPlaying) {
        this.updatePlaylist();
        this.audio.play().catch(err => console.error('Play error:', err));
        this.scheduleAutoRefresh();
      }
    }
  }

  setVolume(volume: number) {
    this.volume = volume;
    this.audio.volume = this.isMuted ? 0 : volume / 100;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.audio.volume = this.isMuted ? 0 : this.volume / 100;
  }

  private async loadFingerprint() {
    await this.rootStore.deviceFingerprintStore.loadFingerprint();
    this.deviceId = this.rootStore.deviceFingerprintStore.getDeviceId || '';

    if (!this.deviceId) {
      console.error('Ошибка: fingerprint не загружен');
    }
  }

  private setError(message: string) {
    this.error = message;
    setTimeout(() => this.error = null, 5000);
  }
}

export default AudioStore;
