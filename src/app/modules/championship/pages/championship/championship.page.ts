import { trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

import { ApplicationService } from '@app/services';
import { routerTransition } from '@shared/animations';
import { Tab } from '@data/types';

@Component({
  animations: [trigger('contextChange', routerTransition)],
  templateUrl: './championship.page.html',
})
export class ChampionshipPage implements OnInit {
  public tabs: Array<Tab>;

  constructor(private readonly app: ApplicationService) {}

  public ngOnInit(): void {
    this.loadTab();
  }

  public loadTab(): void {
    this.tabs = [
      { label: 'Squadre', link: 'teams' },
      { label: 'Classifica', link: 'ranking' },
      { label: 'Giocatori liberi', link: 'members/free' },
      { label: 'Articoli', link: 'articles' },
      { label: 'Attività', link: 'stream' },
    ];
    if (this.app.user?.admin || this.app.team?.admin) {
      this.tabs.push({ label: 'Admin', link: 'admin' });
    }
  }

  public track(_: number, item: Tab): string {
    return item.link;
  }
}
