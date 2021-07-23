import { trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

import { ApplicationService } from '@app/services';
import { routerTransition } from '@shared/animations';
import { Tab, Team, User } from '@data/types';
import { AuthenticationService } from '@app/authentication';
import { combineLatest, firstValueFrom, map } from 'rxjs';

@Component({
  animations: [trigger('contextChange', routerTransition)],
  templateUrl: './championship.page.html',
})
export class ChampionshipPage implements OnInit {
  public tabs: Array<Tab>;

  constructor(
    private readonly auth: AuthenticationService,
    private readonly app: ApplicationService,
  ) {}

  public async ngOnInit(): Promise<void> {
    return firstValueFrom(
      combineLatest([this.auth.userChange$, this.app.teamChange$]).pipe(
        map(([user, team]) => this.loadTab(user, team)),
      ),
    );
  }

  public loadTab(user?: User, team?: Team): void {
    this.tabs = [
      { label: 'Squadre', link: 'teams' },
      { label: 'Classifica', link: 'ranking' },
      { label: 'Giocatori liberi', link: 'members/free' },
      { label: 'Articoli', link: 'articles' },
      { label: 'Attività', link: 'stream' },
    ];
    if (user?.admin || team?.admin) {
      this.tabs.push({ label: 'Admin', link: 'admin' });
    }
  }

  public track(_: number, item: Tab): string {
    return item.link;
  }
}
