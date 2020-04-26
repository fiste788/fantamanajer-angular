import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { LayoutService } from '@app/services';
import { scrollUpAnimation } from '@shared/animations';

@Component({
  selector: 'fm-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  animations: [scrollUpAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush
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
