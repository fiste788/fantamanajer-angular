import { Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, map } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { ApplicationService } from '@app/services';
import { Tab, Team, User } from '@data/types';
import { ToolbarTabComponent } from '@shared/components/toolbar-tab/toolbar-tab.component';

@Component({
  templateUrl: './championship.page.html',
  standalone: true,
  imports: [ToolbarTabComponent],
})
export class ChampionshipPage {
  protected tabs: Signal<Array<Tab>>;

  constructor(
    private readonly auth: AuthenticationService,
    private readonly app: ApplicationService,
  ) {
    this.tabs = toSignal(
      combineLatest([this.auth.user$, this.app.team$]).pipe(
        map(([user, team]) => this.loadTab(user, team)),
      ),
      { initialValue: [] },
    );
  }

  protected loadTab(user?: User, team?: Team): Array<Tab> {
    const tabs: Array<Tab> = [
      { label: 'Squadre', link: 'teams' },
      { label: 'Classifica', link: 'ranking' },
      { label: 'Giocatori liberi', link: 'members/free' },
      { label: 'Articoli', link: 'articles' },
      { label: 'Attività', link: 'stream' },
    ];
    if (user?.admin ?? team?.admin) {
      tabs.push({ label: 'Admin', link: 'admin' });
    }

    return tabs;
  }
}
