/* eslint-disable @angular-eslint/component-max-inline-declarations */
import {
  animate,
  animateChild,
  group,
  query,
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
      transition('* => rail, * => drawer', [
        query('app-profile, .toggle, .fab', style({ opacity: 0, transform: 'translateX(-5rem)' }), {
          optional: true,
        }),

        group([
          query(
            'app-profile, .toggle, .fab',
            stagger(50, [
              animate(
                '500ms cubic-bezier(0.05, 0.7, 0.1, 1.0)',
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
    '[@listItemAnimation]': 'navigationMode()',
    '[class]': 'navigationMode()',
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

  protected readonly openDrawer = this.#layoutService.openDrawer;
  protected readonly navigationMode = this.#layoutService.navigationMode;
  protected readonly loggedIn$ = inject(AuthenticationService).loggedIn$;

  protected readonly showFab = this.#layoutService.showFab;

  protected clickNav(): void {
    this.#layoutService.toggleDrawer();
  }
}
