import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audio: HTMLAudioElement | null = null;
  private playingSubject = new BehaviorSubject<boolean>(false)
  playing$ = this.playingSubject.asObservable();

  crateAudio(audioElement: HTMLAudioElement) {
    this.audio = audioElement;
  }

  play() {
    if (this.audio) {
      this.audio.play();
      this.playingSubject.next(true);
    }
  }

  pause() {
    if (this.audio) {
      this.audio.pause();
      this.playingSubject.next(false);
    }
  }

  togglePlay() {
    if (this.audio) {
      if (this.playingSubject.value) {
        this.pause();
      } else {
        this.play();
      }
    }
  }

  setVolume(volume: number) {
    if (this.audio) {
      this.audio.volume = volume;
    }
  }

  mute() {
    if (this.audio) {
      this.audio.muted = true;
    }
  }

  unmute() {
    if (this.audio) {
      this.audio.muted = false;
    }
  }

  loadSong(urlSong: string) {
    if (this.audio) {
      this.audio.src = urlSong;
      this.audio.load();
      if (this.playingSubject.value) {
        this.play();
      }
    }
  }
}