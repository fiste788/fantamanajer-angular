import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { combineLatest, map } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { ApplicationService } from '@app/services';
import { Tab, Team, User } from '@data/types';
import { PrimaryTabComponent } from '@shared/components/primary-tab/primary-tab.component';

@Component({
  templateUrl: './championship.page.html',
  imports: [PrimaryTabComponent, AsyncPipe],
})
export class ChampionshipPage {
  readonly #auth = inject(AuthenticationService);
  readonly #app = inject(ApplicationService);

  protected tabs$ = combineLatest([this.#auth.user$, this.#app.team$]).pipe(
    map(([user, team]) => this.loadTab(user, team)),
  );

  protected loadTab(user?: User, team?: Team): Array<Tab> {
    const tabs: Array<Tab> = [
      { label: 'Squadre', link: 'teams' },
      { label: 'Classifica', link: 'ranking' },
      { label: 'Giocatori liberi', link: 'members/free' },
      { label: "Albo d'oro", link: 'roll-of-honor' },
      { label: 'Articoli', link: 'articles' },
      { label: 'Attività', link: 'stream' },
    ];
    if (user?.admin ?? team?.admin) {
      tabs.push({ label: 'Admin', link: 'admin' });
    }

    return tabs;
  }
}
