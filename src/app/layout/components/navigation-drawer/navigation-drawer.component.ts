/* eslint-disable @angular-eslint/component-max-inline-declarations */
import {
  animate,
  animateChild,
  query,
  sequence,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthenticationService } from '@app/authentication';
import { closeAnimation } from '@shared/animations';

import { LayoutService } from '../../services';
import { FabComponent } from '../fab/fab.component';
import { NavigationListComponent } from '../navigation-list/navigation-list.component';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  animations: [
    closeAnimation,
    trigger('listItemAnimation', [
      transition('* => tablet, * => web', [
        query(
          '.web app-profile, .toggle, .fab',
          style({ opacity: 0, transform: 'translateX(-5rem)' }),
          {
            optional: true,
          },
        ),

        sequence([
          query(
            '.web app-profile, .toggle, .fab',
            stagger(20, [
              animate(
                '200ms cubic-bezier(0.3, 0.0, 0.8, 0.15)',
                style({ opacity: 1, transform: 'translateX(0)' }),
              ),
            ]),

            { optional: true },
          ),
          query('app-navigation-list @*', animateChild(), { optional: true }),
        ]),
      ]),
    ]),
  ],
  selector: 'app-navigation-drawer',
  styleUrl: './navigation-drawer.component.scss',
  templateUrl: './navigation-drawer.component.html',
  host: {
    '[@listItemAnimation]': 'size()',
    '[class]': 'size()',
  },
  imports: [
    ProfileComponent,
    MatIconModule,
    MatButtonModule,
    AsyncPipe,
    FabComponent,
    NavigationListComponent,
  ],
})
export class NavigationDrawerComponent {
  readonly #layoutService = inject(LayoutService);

  protected readonly openSidebar = this.#layoutService.openSidebar;
  protected readonly size = this.#layoutService.size;
  protected readonly loggedIn$ = inject(AuthenticationService).loggedIn$;

  protected readonly showFab = this.#layoutService.showFab;

  protected clickNav(): void {
    this.#layoutService.toggleSidebar();
  }
}
