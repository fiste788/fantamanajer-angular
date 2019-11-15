import { Component, EventEmitter, Output, Input } from '@angular/core';
import { scrollUpAnimation } from '@app/core/animations';
import { LayoutService } from '@app/core/services/layout.service';

@Component({
  selector: 'fm-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  animations: [scrollUpAnimation]
})
export class ToolbarComponent {
  @Input() state: VisibilityState;
  @Input() showDrawerButton: boolean;

  constructor(
    private layoutService: LayoutService
  ) { }

  clickNav() {
    this.layoutService.toggleSidebar();
  }

}
