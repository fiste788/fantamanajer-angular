import { Component, inject, linkedSignal } from '@angular/core';

import { AuthenticationService } from '@app/authentication';
import { AppService } from '@app/services';
import type { Tab, Team, User } from '@data/interfaces';
import { PrimaryTabComponent } from '@shared/components/primary-tab/primary-tab.component';

@Component({
  imports: [PrimaryTabComponent],
  templateUrl: './championship.page.html',
})
export class ChampionshipPage {

  readonly #app = inject(AppService);
  readonly #auth = inject(AuthenticationService);

  protected readonly tabs = linkedSignal(() => this.loadTab(this.#auth.currentUser(), this.#app.currentTeam()));

  protected loadTab(user?: User, team?: Team): Tab[] {
    const tabs: Tab[] = [
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
