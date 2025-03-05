import { makeAutoObservable } from 'mobx'

import { RootStore } from '@/stores/RootStore'

class AudioStore {
  isPlaying = false
  volume = 50
  isMuted = false
  audio = new Audio('/muz/focus_8/focus_8_60s_0052.aac')

  constructor(protected rootStore: RootStore) {
    makeAutoObservable(this)
    this.audio.volume = this.volume / 100
  }

  togglePlay() {
    if (this.isPlaying) {
      this.audio.pause()
    } else {
      this.audio.play()
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
}

export default AudioStore
