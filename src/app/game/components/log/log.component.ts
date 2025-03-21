import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Dialogue } from '@data/interfaces';

@Component({
  selector: 'game-log',
  standalone: true,
  imports: [],
  templateUrl: './log.component.html',
  styleUrl: './log.component.css',
})
export class LogComponent {
  @Input() data: Dialogue[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cdr.detectChanges();
  }
  ngAfterViewInit(){
    this.cdr.detectChanges();
  }
}
