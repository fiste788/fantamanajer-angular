/* eslint-disable @angular-eslint/component-max-inline-declarations */
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { AsyncPipe } from '@angular/common';
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
      transition('* => bar', [
        query('&> *', style({ opacity: 0, transform: 'translateY(5rem)' }), {
          optional: true,
        }),

        query(
          '&> *',
          stagger(50, [
            animate(
              '500ms cubic-bezier(0.05, 0.7, 0.1, 1.0)',
              style({ opacity: 1, transform: 'translateY(0)' }),
            ),
          ]),
          { optional: true },
        ),
      ]),
      transition('* => rail, * => drawer', [
        query(
          '.drawer > *, .rail .mat-mdc-list-item, .rail .mat-divider',
          style({ opacity: 0, transform: 'translateX(-5rem)' }),
          {
            optional: true,
          },
        ),

        query(
          '.drawer > *, .rail .mat-mdc-list-item, .rail .mat-divider',
          stagger(50, [
            animate(
              '500ms cubic-bezier(0.05, 0.7, 0.1, 1.0)',
              style({ opacity: 1, transform: 'translateX(0)' }),
            ),
          ]),
          { optional: true },
        ),
      ]),
    ]),
  ],
  selector: 'app-navigation-list',
  imports: [AsyncPipe, RouterModule, MatListModule, MatRippleModule, MatIconModule],
  styleUrl: './navigation-list.component.scss',
  host: {
    '[class]': 'mode()',
  },
  templateUrl: './navigation-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationListComponent {
  public mode = input.required<'lite' | 'full'>();

  readonly #applicationService = inject(ApplicationService);
  readonly #layoutService = inject(LayoutService);

  protected readonly loggedIn$ = inject(AuthenticationService).loggedIn$;
  protected readonly team$ = this.#applicationService.team$;
  protected readonly matchday$ = this.#applicationService.matchday$;
  protected readonly championship$ = this.team$.pipe(map((t) => t?.championship));
  protected readonly navigationMode = this.#layoutService.navigationMode;
}
