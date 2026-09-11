import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AppService } from '@app/services';

import { LayoutService } from '../../services';
import { FabComponent } from '../fab/fab.component';
import { NavigationListComponent } from '../navigation-list/navigation-list.component';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-navigation-drawer',
  imports: [FabComponent, MatButtonModule, MatIconModule, NavigationListComponent, ProfileComponent],
  templateUrl: './navigation-drawer.component.html',
  styleUrl: './navigation-drawer.component.scss',
})
export class NavigationDrawerComponent {

  readonly #layoutService = inject(LayoutService);
  protected readonly team = inject(AppService).currentTeam;

  protected readonly navigationMode = this.#layoutService.navigationMode;
  protected readonly openDrawer = this.#layoutService.openDrawer;

  protected clickNav(): void {
    this.#layoutService.toggleDrawer();
  }

}
