import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '@services/api.service';

@Component({
  selector: 'actions-buttons-renderer',
  standalone: true,
  imports: [],
  templateUrl: './actions-buttons-renderer.component.html',
  styleUrl: './actions-buttons-renderer.component.css'
})

export class ActionsButtonsRenderer {
  params: any;

  constructor( private api:ApiService,private router:Router ){}

  agInit(params: any): void {
    this.params = params;
  }

  edit(){
    this.router.navigate([`/game/edit/${this.params.data.id}`])
  }

  delete(){
    const data = this.params.data;
    this.api.deleteGame(data.id).subscribe((_)=>{
      this.params.node.setDataValue('status', (data.status));
      this.params.api.applyTransaction({
        remove: [this.params.data]
      });
    });
  }


  toogleVisibility(){
    const data = this.params.data;
    data.status = !data.status;
    delete data.author;
    this.api.updateGame(data).subscribe((_)=>{
      this.params.node.setDataValue('status', (data.status));
    });
    
  }

  play(){
    this.router.navigate([`/game/id/${this.params.data.id}`])
  }
}
