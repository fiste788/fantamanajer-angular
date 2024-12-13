/* eslint-disable @angular-eslint/component-max-inline-declarations */
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { map } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { ApplicationService } from '@app/services';

import { LayoutService } from '../../services';

@Component({
  animations: [
    trigger('listItemAnimation', [
      transition('* => handset', [
        query('&> *', style({ opacity: 0, transform: 'translateY(5rem)' }), {
          optional: true,
        }),

        query(
          '&> *',
          stagger(20, [
            animate(
              '200ms cubic-bezier(0.3, 0.0, 0.8, 0.15)',
              style({ opacity: 1, transform: 'translateY(0)' }),
            ),
          ]),
          { optional: true },
        ),
      ]),
      transition('* => tablet, * => web', [
        query(
          '.web > *, .tablet .mat-mdc-list-item, .tablet .mat-divider',
          style({ opacity: 0, transform: 'translateX(-5rem)' }),
          {
            optional: true,
          },
        ),

        query(
          '.web > *, .tablet .mat-mdc-list-item, .tablet .mat-divider',
          stagger(20, [
            animate(
              '200ms cubic-bezier(0.3, 0.0, 0.8, 0.15)',
              style({ opacity: 1, transform: 'translateX(0)' }),
            ),
          ]),
          { optional: true },
        ),
      ]),
    ]),
  ],
  selector: 'app-navbar-list',
  imports: [AsyncPipe, RouterModule, MatListModule, MatRippleModule, MatIconModule, NgClass],
  styleUrl: './navbar-list.component.scss',
  host: {
    '[class]': 'mode()',
  },
  templateUrl: './navbar-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarListComponent {
  public mode = input.required<'drawer' | 'rail' | 'bar'>();

  readonly #applicationService = inject(ApplicationService);
  readonly #layoutService = inject(LayoutService);

  protected readonly loggedIn$ = inject(AuthenticationService).loggedIn$;
  protected readonly team$ = this.#applicationService.team$;
  protected readonly matchday$ = this.#applicationService.matchday$;
  protected readonly championship$ = this.team$.pipe(map((t) => t?.championship));
  protected readonly size = this.#layoutService.size;
}
