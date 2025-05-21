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
  selector: 'app-navigation-list',
  imports: [RouterModule, MatListModule, MatRippleModule, MatIconModule],
  styleUrl: './navigation-list.component.scss',
  host: {
    '[class]': 'mode() + " navigation navigation-" + navigationMode()',
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
  protected readonly matchday = toSignal(this.#applicationService.matchday$);
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
      header?: string;
    }>();

    const team = this.team();
    const mode = this.mode();
    const matchday = this.matchday();
    const header =
      mode === 'full' && matchday
        ? !matchday.season.ended && matchday.season.started
          ? `Giornata ${matchday.number}`
          : matchday.season.name
        : '';
    items.push({ title: 'Home', url: '/', exact: true, icon: 'home', header });
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
        header: 'Profilo',
        title_short: 'Io',
        icon: 'account_circle',
      });
      if (mode == 'full') {
        items.push({ title: 'Logout', url: '/auth/logout', icon: 'exit_to_app' });
      }
    } else {
      items.push({
        title: 'Accedi',
        url: '/auth/login',
        divider: true,
        header: 'Profilo',
        icon: 'input',
      });
    }

    return items;
  });
}
