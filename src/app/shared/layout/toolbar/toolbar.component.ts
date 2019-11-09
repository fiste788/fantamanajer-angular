import { Component, EventEmitter, Output, Input } from '@angular/core';
import { scrollUpAnimation } from '@app/core/animations';

@Component({
  selector: 'fm-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  animations: [scrollUpAnimation]
})
export class ToolbarComponent {
  @Input() state: VisibilityState;
  @Input() showDrawerButton: boolean;
  @Output() clickToggleNav = new EventEmitter<void>();

  constructor() { }

  clickNav() {
    this.clickToggleNav.emit(null);
  }

}
