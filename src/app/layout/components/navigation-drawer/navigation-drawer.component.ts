import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthenticationService } from '@app/authentication';

import { LayoutService } from '../../services';
import { FabComponent } from '../fab/fab.component';
import { NavigationListComponent } from '../navigation-list/navigation-list.component';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-navigation-drawer',
  styleUrl: './navigation-drawer.component.scss',
  templateUrl: './navigation-drawer.component.html',
  imports: [
    ProfileComponent,
    MatIconModule,
    MatButtonModule,
    FabComponent,
    NavigationListComponent,
  ],
})
export class NavigationDrawerComponent {
  readonly #layoutService = inject(LayoutService);

  protected readonly openDrawer = this.#layoutService.openDrawer;
  protected readonly navigationMode = this.#layoutService.navigationMode;
  protected readonly loggedIn = inject(AuthenticationService).loggedIn;

  protected clickNav(): void {
    this.#layoutService.toggleDrawer();
  }
}
