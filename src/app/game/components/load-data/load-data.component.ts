import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiService } from '@services/api.service';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'load-data',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './load-data.component.html',
  styleUrl: './load-data.component.css'
})
export class LoadDataComponent {
  @Input() gameId:any;
  @Output() gameLoadedChange = new EventEmitter<any>();
  data:any = Array(6).fill("");

  constructor(private api:ApiService,private auth:AuthService) {}

  ngOnInit() {
    this.api.getSaveGame(this.auth.getUserData().id,this.gameId).subscribe((res)=>{
      this.data = res;
      this.data = [...res, ...new Array(6 - res.length).fill('')].slice(0, 6);
    })
  }

  loadData(d:any){
    if(d){
      this.gameLoadedChange.emit({
        load: true,
        scene: d.scene,
        dialogue:d.dialogue
      });
    }
  }
}
