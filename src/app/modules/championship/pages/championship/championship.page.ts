import { trigger } from '@angular/animations';
import { NgIf, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLinkActive, RouterLink, RouterOutlet } from '@angular/router';
import { combineLatest, firstValueFrom, map } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { ApplicationService } from '@app/services';
import { Tab, Team, User } from '@data/types';
import { routerTransition } from '@shared/animations';
import { StatePipe } from '@shared/pipes';

@Component({
  animations: [trigger('contextChange', routerTransition)],
  templateUrl: './championship.page.html',
  standalone: true,
  imports: [NgIf, MatTabsModule, NgFor, RouterLinkActive, RouterLink, RouterOutlet, StatePipe],
})
export class ChampionshipPage implements OnInit {
  protected tabs: Array<Tab> = [];

  constructor(
    private readonly auth: AuthenticationService,
    private readonly app: ApplicationService,
  ) {}

  public async ngOnInit(): Promise<void> {
    return firstValueFrom(
      combineLatest([this.auth.user$, this.app.team$]).pipe(
        map(([user, team]) => this.loadTab(user, team)),
      ),
      { defaultValue: undefined },
    );
  }

  protected loadTab(user?: User, team?: Team): void {
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

  protected track(_: number, item: Tab): string {
    return item.link;
  }
}
