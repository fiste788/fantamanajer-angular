import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { LayoutService } from '@layout/services';

@Component({
  selector: 'app-navigation-drawer-button',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './navigation-drawer-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationDrawerButtonComponent {
  readonly #layoutService = inject(LayoutService);

  protected clickNav(): void {
    this.#layoutService.toggleDrawer();
  }
}
