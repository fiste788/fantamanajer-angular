/* eslint-disable @angular-eslint/component-max-inline-declarations */
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, linkedSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule, UrlTree } from '@angular/router';

import { AuthenticationService } from '@app/authentication';
import { ApplicationService } from '@app/services';

import { LayoutService } from '../../services';

@Component({
  animations: [
    trigger('listItemAnimation', [
      transition('* => bar', [
        query('[direction=right] > *', style({ opacity: 0, transform: 'translateY(5rem)' }), {
          optional: true,
        }),

        query('[direction=down] > *', style({ opacity: 0, transform: 'translateX(-5rem)' }), {
          optional: true,
        }),

        query(
          '&> *',
          stagger(50, [
            animate(
              '500ms cubic-bezier(0.05, 0.7, 0.1, 1.0)',
              style({ opacity: 1, transform: 'translate(0, 0)' }),
            ),
          ]),
          { optional: true },
        ),
      ]),
      transition('* => rail, * => drawer', [
        query('&> *', style({ opacity: 0, transform: 'translateX(-5rem)' }), {
          optional: true,
        }),

        query(
          '&> *',
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

  protected readonly loggedIn = inject(AuthenticationService).loggedIn;
  protected readonly team = toSignal(this.#applicationService.team$);
  protected readonly matchday$ = this.#applicationService.matchday$;
  protected readonly navigationMode = this.#layoutService.navigationMode;
  protected readonly openDrawer = this.#layoutService.openDrawer.asReadonly();

  protected readonly items = linkedSignal(() => {
    const items = new Array<{
      title: string;
      url: string | Array<unknown> | UrlTree;
      icon: string;
      exact?: boolean;
      title_short?: string;
      divider?: boolean;
    }>();

    const team = this.team();
    const mode = this.mode();
    items.push({ title: 'Home', url: '/', exact: true, icon: 'home' });
    if (team) {
      items.push(
        { title: team.name, url: ['teams', team.id], title_short: 'Squadra', icon: 'groups_3' },
        {
          title: team.championship.league.name,
          url: ['championships', team.championship.id],
          icon: 'emoji_events',
          title_short: 'Lega',
        },
      );
    }
    if (mode === 'full' || (mode === 'lite' && !this.loggedIn())) {
      items.push({ title: 'Clubs', url: '/clubs', icon: 'sports_soccer' });
    }
    if (this.loggedIn()) {
      items.push({
        title: 'Profilo',
        url: '/user',
        divider: true,
        title_short: 'Io',
        icon: 'account_circle',
      });
      if (mode == 'full') {
        items.push({ title: 'Logout', url: '/auth/logout', icon: 'exit_to_app' });
      }
    } else {
      items.push({ title: 'Accedi', url: '/auth/login', divider: true, icon: 'input' });
    }

    return items;
  });
}
