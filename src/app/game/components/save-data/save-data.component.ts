import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { SaveData } from '@data/interfaces';
import { ApiService } from '@services/api.service';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'save-data',
  standalone: true,
  imports: [ DatePipe ],
  templateUrl: './save-data.component.html',
  styleUrl: './save-data.component.css'
})
export class SaveDataComponent {
  @Input() data: any = new Array(6).fill('');
  @Input() saveDataValue: any;
  /**
   *
   */
  constructor(private api:ApiService,private auth:AuthService, private cdr: ChangeDetectorRef) {
    // console.log(this.auth.getUserData())
  }

  ngOnInit() {
    this.api.getSaveGame(this.auth.getUserData().id,this.saveDataValue.gameId).subscribe((res)=>{
      if (res.length > 0) this.data = res;
      this.data = [...res, ...new Array(6 - res.length).fill('')].slice(0, 6);
    })
  }
  saveData(d:any){
    const data:SaveData = 
    {
      userId:this.auth.getUserData().id,
      gameId:parseInt(this.saveDataValue.gameId),
      scene:this.saveDataValue.currentScene,
      dialogue:this.saveDataValue.currentDialogue,
      savedAt:this.saveDataValue.date
    }

    if(d) data.id = d.id;
    
    this.api.saveGame(data).subscribe((_)=>{
      this.updateData(data);
      this.cdr.detectChanges();
    })
  }

  updateData(newData:any){
    if('id' in newData){
      const index = this.data.findIndex((game:any) => game.id === newData.id);
      if (index !== -1) { this.data[index] = newData }
    } else{
      this.data = this.data.filter((d:any) => d !== '');
      this.data.push(newData);
      this.data = this.data.concat(Array(6 - this.data.length).fill('')).slice(0, 6);
    }
  }
}
