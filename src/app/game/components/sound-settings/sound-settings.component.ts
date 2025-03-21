import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AudioService } from '@services/audio.service';

@Component({
  selector: 'sound-settings',
  standalone: true,
  imports: [FormsModule ],
  templateUrl: './sound-settings.component.html',
  styleUrl: './sound-settings.component.css'
})
export class SoundSettingsComponent {
  audio: HTMLAudioElement ;
  volume: number = 0.5;
  muted: boolean = false;

  constructor(private player:AudioService) { this.audio = new Audio(); }
  
  ngOnInit() {
    this.player.crateAudio(this.audio);
    this.player.setVolume(this.volume);
  
  }
  changeVolume(event: any) {
    this.volume = event.target.value;
    this.audio.volume = this.volume;
  }

  toggleMute() {
    this.muted = !this.muted;
    this.audio.muted = this.muted;
  }

}

// TODO -> IMPROVE INTERFACE - HTML CSS