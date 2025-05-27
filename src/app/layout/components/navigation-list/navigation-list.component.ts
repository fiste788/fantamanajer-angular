import { ChangeDetectionStrategy, Component, inject, input, linkedSignal } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule, UrlTree } from '@angular/router';

import { AuthenticationService } from '@app/authentication';
import { ApplicationService } from '@app/services';
import { Matchday, Team } from '@data/types';

import { LayoutService } from '../../services';

interface NavigationItem {
  title: string;
  url: string | Array<unknown> | UrlTree;
  icon: string;
  exact?: boolean;
  title_short?: string;
  divider?: boolean;
  header?: string;
}

@Component({
  selector: 'app-navigation-list',
  imports: [RouterModule, MatListModule, MatRippleModule, MatIconModule],
  styleUrl: './navigation-list.component.scss',
  templateUrl: './navigation-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationListComponent {
  public mode = input.required<'lite' | 'full'>();

  readonly #applicationService = inject(ApplicationService);
  readonly #layoutService = inject(LayoutService);
  readonly #authenticationService = inject(AuthenticationService);

  protected readonly navigationMode = this.#layoutService.navigationMode;
  protected readonly openDrawer = this.#layoutService.openDrawer.asReadonly();
  protected readonly items = linkedSignal(() =>
    this.#getItems(
      this.mode(),
      this.#authenticationService.loggedIn(),
      this.#applicationService.matchday(),
      this.#applicationService.team(),
    ),
  );

  #getItems(
    mode: 'lite' | 'full',
    loggedIn: boolean,
    matchday?: Matchday,
    team?: Team,
  ): Array<NavigationItem> {
    const items = new Array<NavigationItem>();
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
    if (mode === 'full' || (mode === 'lite' && !loggedIn)) {
      items.push({ title: 'Clubs', url: '/clubs', icon: 'sports_soccer' });
    }
    if (loggedIn) {
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
  }
}
