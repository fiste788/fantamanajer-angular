import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AuthenticationService } from '@app/authentication';

import { LayoutService } from '../../services';
import { FabComponent } from '../fab/fab.component';
import { NavigationListComponent } from '../navigation-list/navigation-list.component';

@Component({
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

  protected readonly loggedIn = inject(AuthenticationService).isLoggedIn;
  protected readonly openFab = this.#layoutService.openFab;
}
