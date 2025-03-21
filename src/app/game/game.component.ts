import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Renderer2, ElementRef, ViewChild } from '@angular/core';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { interval, map, Subscription, switchMap } from 'rxjs';
import { LogComponent } from './components/log/log.component';
import { Dialogue } from '@data/interfaces';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '@services/api.service';
import { SoundSettingsComponent } from './components/sound-settings/sound-settings.component';
import { AudioService } from '@services/audio.service';
import { LoadDataComponent } from './components/load-data/load-data.component';
import { SaveDataComponent } from './components/save-data/save-data.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [LogComponent, SoundSettingsComponent, LoadDataComponent, SaveDataComponent,ModalComponent,CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})

export class GameComponent {
  gameLoaded:boolean = false;
  id: string | null = null;
  data:any;
  showModal:boolean = false;
  showLogModal:boolean = false;
  showLoadDataModal:boolean = false;
  showSaveDataModal:boolean = false;
  isFullScreen:boolean = false;
  btn_auto: string = 'btn';
  btn_ffw: string = 'btn';
  autoSub!: Subscription;
  log: Dialogue[] = [];
  currentScene = 0;
  // private currentScene = 0;
  private currentDialogue = 0;

  @ViewChild('bgTitle') bgTitle!: ElementRef;
  @ViewChild('background') background!: ElementRef;
  @ViewChild('bgm') bgm!: ElementRef;
  @ViewChild('character') character!: ElementRef;
  @ViewChild('text') text!: ElementRef;

  constructor(private route: ActivatedRoute,private api:ApiService, private cdr: ChangeDetectorRef,private player:AudioService) {}
  ngOnInit(): void {
    // Obtener el parámetro 'id' de la URL
    this.id = this.route.snapshot.paramMap.get('id');
    this.api.getGame(this.id!).subscribe((res)=>{
      this.data = JSON.parse(res.data);
      this.bgTitle.nativeElement.style.backgroundImage = `url(${this.data.background})`;
    });
  }

  ngAfterViewInit(): void {}
  // ngAfterViewChecked(): void {}

  /* TITLE CONTROLS */
  startGame(){
    this.gameLoaded = true;
    this.cdr.detectChanges();
    this.loadScene(0);
  }
  loadGame(data: { load:boolean, scene: number; dialogue: number }){
    this.gameLoaded = data.load;
    this.currentScene = data.scene;
    this.currentDialogue = data.dialogue;
    this.showLoadDataModal = false;
    this.cdr.detectChanges();
    this.loadScene(data.scene);
  }

  getSaveData(){
    const data = {
      gameId:this.id,
      currentScene : this.currentScene,
      currentDialogue : this.currentDialogue,
      date:new Date().toISOString()
    }
    // this.cdr.detectChanges();
    return data;
  }

  /* GAME - CORE */
  loadScene(sceneIndex:number) {
    const scene = this.data.scenes[sceneIndex];
    this.background.nativeElement.style.backgroundImage = `url(${scene.background})`;
    this.player.loadSong(scene.bgm);
    this.player.play()
    this.cdr.detectChanges();
    this.loadDialogue();
  }
  // !FIX : Bug al guardar en el Gamve Over.
  loadBackground(){
    const scene = this.data.scenes[this.currentScene];
    this.background.nativeElement.style.backgroundImage = `url(${scene.background})`;
  }

  loadDialogue() {
    const scene = this.data.scenes[this.currentScene];
    const dialogue = scene.dialogues[this.currentDialogue];

    if (dialogue) {
      this.character.nativeElement.textContent = `${dialogue.name}`;
      this.text.nativeElement.textContent = dialogue.text;
      this.log.push({name:dialogue.name,text:dialogue.text}); // GUARDAR - LOG
    } else {
      if(this.currentScene < this.data.scenes.length){
        // Si se terminan los diálogos de la escena, ir a la siguiente escena
        this.currentScene++;
        if (this.currentScene < this.data.scenes.length) {
          this.currentDialogue = 0;
          this.loadScene(this.currentScene);
        } else {
          // END - GAME
          this.character.nativeElement.textContent = 'GAME';
          this.text.nativeElement.textContent = 'Fin de la historia.';
        }
      }
    }
  }

  nextEvent(){
    // SI ES EL FINAL DEL JUEGO QUE CARGUE EL GAME OVER SI ESTA EN FULL SCREEN
    if(this.isFullScreen){
      this.isFullScreen = false;
      this.cdr.detectChanges();
      this.loadDialogue();
      return;
    }
    if (this.currentScene < this.data.scenes.length) {
      const scene = this.data.scenes[this.currentScene];
      this.currentDialogue++;
      if (this.currentDialogue < scene.dialogues.length) {
        this.loadDialogue();
      } else {
        this.loadDialogue();
      }
    }
  }

 /* GAME - CONTROLS */
  nextScene(e: Event){ 
    e.stopPropagation();
    if (this.currentScene < this.data.scenes.length - 1){
      this.currentScene++;
      this.currentDialogue = 0;
      this.loadBackground();
      this.loadDialogue();
    }
    // else {this.nextEvent();}
  }

  fullScreen(e: Event){
    this.isFullScreen = true;
    e.stopPropagation();
  }

  saveGame(){
    // e.stopPropagation();
    // this.currentScene;
    // this.currentDialogue;
    // new Date()
    // PETICION API PARA GUARDAR LA DATA
  }

  openModalLog(e?: Event) {
    if(e)e.stopPropagation();
    this.showLogModal = !this.showLogModal;
  }

  toggleModal(e?: Event) {
    if(e)e.stopPropagation();
    this.showModal = !this.showModal;
  }

  toggleLoadDataModal(e?: Event) {
    if(e)e.stopPropagation();
    this.showLoadDataModal = !this.showLoadDataModal;
  }

  toggleSaveDataModal(e?: Event) {
    if(e)e.stopPropagation();
    this.showSaveDataModal = !this.showSaveDataModal;
  }

  /* TEXT - CONTROLS */
  autoScene(e: Event){
    e.stopPropagation();
    this.btn_auto = this.btn_auto === 'btn' ? 'btn_active' : 'btn';
    if (this.btn_auto=='btn'){
      this.autoSub.unsubscribe();
    } else{
      this.autoSub = interval(5000).subscribe(() => {
        this.nextEvent()
      });
    }
  }

  fastScene(e: Event){
    e.stopPropagation();
    this.btn_ffw = this.btn_ffw === 'btn' ? 'btn_active' : 'btn';
    if (this.btn_ffw=='btn'){
      this.autoSub.unsubscribe();
    } else{
      this.autoSub = interval(1000).subscribe(() => {
        this.nextEvent()
      });
    }
  }
}






// export class GameComponent {
//   showModal:boolean = false;
//   showLogModal:boolean = false;
//   btn_auto: string = 'btn';
//   btn_ffw: string = 'btn';
//   autoSub!: Subscription;
//   logComponent = LogComponent;
//   log: Dialogue[] = [];
//   gameStarted:Boolean=false;
//   public scenes = [
//     {
//       background: 'demo/1.png',
//       bgm: 'demo/OST_01.mp3',
//       dialogues: [
//         { name: 'María', text: 'Es un día precioso, ¿no crees?' },
//         { name: 'Carlos', text: 'Sí, pero siento que hay algo en el aire... algo diferente.' },
//       ]
//     },
//     {
//       background: 'demo/2.png',
//       bgm: 'night_ambient.mp3',
//       dialogues: [
//         { name: 'María', text: 'La noche está más oscura de lo normal...' },
//         { name: 'Carlos', text: 'Tal vez sea una señal de lo que está por venir.' },
//       ]
//     }
//   ];
//   private currentScene = 0;
//   private currentDialogue = 0;
//   id: string | null = null;
//   constructor(private renderer: Renderer2,private cdr: ChangeDetectorRef,private route: ActivatedRoute) {}
//   ngOnInit(): void {
//     // Obtener el parámetro 'id' de la URL
//     this.id = this.route.snapshot.paramMap.get('id');
//   }
//   // MANEJAR EL DOM EN ANGULAR
//   @ViewChild('background') background!: ElementRef;
//   @ViewChild('bgm') bgm!: ElementRef;
//   @ViewChild('character') character!: ElementRef;
//   @ViewChild('text') text!: ElementRef;

//   ngAfterViewInit() {
//     this.loadScene(0);
//     this.cdr.detectChanges();
//   }

//   // Cargar escena inicial
//   loadScene(sceneIndex:number) {
//     const scene = this.scenes[sceneIndex];
//     this.background.nativeElement.style.backgroundImage = `url(${scene.background})`;
//     // background.src = scene.background;
//     console.log(scene.bgm)
//     this.bgm.nativeElement.src = scene.bgm;
//     // this.bgm.nativeElement.play();

//     this.currentDialogue = 0;
//     this.loadDialogue();
//   }
//   // Cargar diálogo actual
//   loadDialogue() {
//     const scene = this.scenes[this.currentScene];
//     const dialogue = scene.dialogues[this.currentDialogue];

//     if (dialogue) {
//       this.character.nativeElement.textContent = `${dialogue.name}`;
//       this.text.nativeElement.textContent = dialogue.text;
//       // ACTUALIZAR EL LOG
//       this.log.push({name:dialogue.name,text:dialogue.text});
//       console.log(this.log)
//     } else {
//       if(this.currentScene<this.scenes.length){
//         // Si se terminan los diálogos de la escena, ir a la siguiente escena
//         this.currentScene++;
//         if (this.currentScene < this.scenes.length) {
//           this.loadScene(this.currentScene);
//         } else {
//           // Fin del juego
//           this.character.nativeElement.textContent = 'GAME';
//           this.text.nativeElement.textContent = 'Fin de la historia.';
//         }
//       }
//     }
//   }

//   nextEvent(){
//     if (this.currentScene < this.scenes.length) {
//       const scene = this.scenes[this.currentScene];
//       console.log(scene)
//       this.currentDialogue++;
//       if (this.currentDialogue < scene.dialogues.length) {
//         this.loadDialogue();
//       } else {
//         this.loadDialogue(); // Pasar a la siguiente escena automáticamente
//       }
//     }
//   }

//   /* GAME - CONTROLS */
//   nextScene(e: Event){ 
//     e.stopPropagation();
//     this.currentScene++;
//     this.currentDialogue = 0;
//     this.loadDialogue();
//     console.log(this.currentDialogue)
//   }

//   autoScene(e: Event){
//     e.stopPropagation();
//     this.btn_auto = this.btn_auto === 'btn' ? 'btn_active' : 'btn';
//     if (this.btn_auto=='btn'){
//       this.autoSub.unsubscribe();
//     } else{
//       this.autoSub = interval(5000).subscribe(() => {
//         this.nextEvent()
//       });
//     }
//   }

//   fastScene(e: Event){
//     e.stopPropagation();
//     this.btn_ffw = this.btn_ffw === 'btn' ? 'btn_active' : 'btn';
//     if (this.btn_ffw=='btn'){
//       this.autoSub.unsubscribe();
//     } else{
//       this.autoSub = interval(1000).subscribe(() => {
//         this.nextEvent()
//       });
//     }
//   }

//   openModalLog(e?: Event) {
//     if(e)e.stopPropagation();
//     this.showLogModal = !this.showLogModal;
//   }


//   toggleModal(e?: Event) {
//     if(e)e.stopPropagation();
//     this.showModal = !this.showModal;
//   }
// }
