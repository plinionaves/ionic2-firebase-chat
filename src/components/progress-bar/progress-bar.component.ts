import { Component, Input } from '@angular/core';

@Component({
  selector: 'progress-bar',
  templateUrl: 'progress-bar.component.html'
})
export class ProgressBarComponent {

  @Input() progress: number;

  constructor() {}

}
