import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AuthenticationService } from '@app/authentication';
import { VisibilityState } from '@app/enums';
import { closeAnimation } from '@shared/animations';

import { LayoutService } from '../../services';
import { FabComponent } from '../fab/fab.component';
import { NavigationListComponent } from '../navigation-list/navigation-list.component';

@Component({
  animations: [closeAnimation],
  selector: 'app-navigation-bar',
  imports: [MatToolbarModule, NavigationListComponent, FabComponent],
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss',
  host: {
    class: 'navigation-bar',
  },
})
export class NavigationBarComponent {
  readonly #layoutService = inject(LayoutService);

  protected readonly loggedIn = inject(AuthenticationService).loggedIn;
  protected readonly openFab = this.#layoutService.openFab;
  protected readonly showBars = this.#layoutService.showBars;
  protected readonly stable = this.#layoutService.stable;
  protected readonly hidden = VisibilityState.Hidden;
}
