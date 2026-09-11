import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

import { AuthenticationService } from '@app/authentication';
import { AppService } from '@app/services';
import type { Matchday, Team } from '@data/interfaces';
import type { NavigationItem } from '@layout/interfaces';

import { LayoutService } from '../../services';

@Component({
  selector: 'app-navigation-list',
  imports: [MatIconModule, MatListModule, MatRippleModule, RouterModule],
  templateUrl: './navigation-list.component.html',
  styleUrl: './navigation-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationListComponent {

  readonly #applicationService = inject(AppService);
  readonly #authenticationService = inject(AuthenticationService);
  readonly #layoutService = inject(LayoutService);

  public readonly mode = input.required<'full' | 'lite'>();

  // Using computed signal for items
  protected readonly items = computed(() => {
    const mode = this.mode();
    const isLoggedIn = this.#authenticationService.isLoggedIn();
    const currentMatchday = this.#applicationService.currentMatchday();
    const currentTeam = this.#applicationService.currentTeam();

    // Se l'utente è loggato e il team non è ancora disponibile,
    // restituisci un array vuoto per non visualizzare nulla
    if (isLoggedIn && !currentTeam) {
      return [];
    }

    // Altrimenti, procedi con la costruzione della navigazione
    return this.#buildNavigationItems(mode, isLoggedIn, currentMatchday, currentTeam);
  });
  protected readonly navigationMode = this.#layoutService.navigationMode;
  protected readonly openDrawer = this.#layoutService.openDrawer.asReadonly();

  #addClubsItem(items: NavigationItem[], mode: 'full' | 'lite', isLoggedIn: boolean): void {
    if (mode === 'full' || !isLoggedIn) {
      items.push({ icon: 'sports_soccer', title: 'Clubs', url: '/clubs' });
    }
  }

  #addHomeItem(items: NavigationItem[], mode: 'full' | 'lite', matchday?: Matchday): void {
    const header = mode === 'full' && matchday ? (!matchday.season.ended && matchday.season.started ? `Giornata ${matchday.number}` : matchday.season.name) : '';
    items.push({ exact: true, header, icon: 'home', title: 'Home', url: '/' });
  }

  #addProfileAndAuthItems(items: NavigationItem[], mode: 'full' | 'lite', isLoggedIn: boolean): void {
    if (isLoggedIn) {
      items.push({
        divider: true,
        header: 'Profilo',
        icon: 'account_circle',
        title: 'Profilo',
        title_short: 'Io',
        url: '/user',
      });

      if (mode === 'full') {
        items.push({ icon: 'exit_to_app', title: 'Logout', url: '/auth/logout' });
      }
    } else {
      items.push({
        divider: true,
        header: 'Profilo',
        icon: 'input',
        title: 'Accedi',
        url: '/auth/login',
      });
    }
  }

  #addTeamAndChampionshipItems(items: NavigationItem[], team?: Team): void {
    if (team) {
      items.push(
        {
          icon: 'groups_3',
          title: team.name,
          title_short: 'Squadra',
          url: ['teams', team.id],
        },
        {
          icon: 'emoji_events',
          title: team.championship.league.name,
          title_short: 'Lega',
          url: ['championships', team.championship.id],
        },
      );
    }
  }

  // Renamed and refactored the method to be more focused
  #buildNavigationItems(mode: 'full' | 'lite', isLoggedIn: boolean, matchday?: Matchday, team?: Team): NavigationItem[] {
    const items: NavigationItem[] = [];

    this.#addHomeItem(items, mode, matchday);
    this.#addTeamAndChampionshipItems(items, team);
    this.#addClubsItem(items, mode, isLoggedIn);
    this.#addProfileAndAuthItems(items, mode, isLoggedIn);

    return items;
  }

}
