import { Component, Input } from '@angular/core';
import { LayoutService } from '@app/core/services';
import { scrollUpAnimation } from '@app/shared/animations';

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
    private readonly layoutService: LayoutService
  ) { }

  clickNav(): void {
    this.layoutService.toggleSidebar();
  }

}
