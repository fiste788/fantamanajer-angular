import { trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

import { ApplicationService } from '@app/services';
import { routerTransition } from '@shared/animations';
import { Tab, User } from '@data/types';
import { AuthenticationService } from '@app/authentication';
import { firstValueFrom, map } from 'rxjs';

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
    return firstValueFrom(this.auth.userChange$.pipe(map((user) => this.loadTab(user))));
  }

  public loadTab(user?: User): void {
    this.tabs = [
      { label: 'Squadre', link: 'teams' },
      { label: 'Classifica', link: 'ranking' },
      { label: 'Giocatori liberi', link: 'members/free' },
      { label: 'Articoli', link: 'articles' },
      { label: 'Attività', link: 'stream' },
    ];
    if (user?.admin || this.app.team?.admin) {
      this.tabs.push({ label: 'Admin', link: 'admin' });
    }
  }

  public track(_: number, item: Tab): string {
    return item.link;
  }
}
