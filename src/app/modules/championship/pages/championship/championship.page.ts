import { trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

import { ApplicationService } from '@app/services';
import { routerTransition } from '@shared/animations';
import { Tab } from '@shared/models';

@Component({
  templateUrl: './championship.page.html',
  animations: [
    trigger('contextChange', routerTransition)
  ]
})
export class ChampionshipPage implements OnInit {
  tabs: Array<Tab>;

  constructor(private readonly app: ApplicationService) {
  }

  ngOnInit(): void {
    this.loadTab();
  }

  loadTab(): void {
    this.tabs = [
      { label: 'Squadre', link: 'teams' },
      { label: 'Classifica', link: 'ranking' },
      { label: 'Giocatori liberi', link: 'members/free' },
      { label: 'Articoli', link: 'articles' },
      { label: 'Attività', link: 'stream' }
    ];
    if (this.app.user?.admin || this.app.team?.admin) {
      this.tabs.push({ label: 'Admin', link: 'admin' });
    }
  }

  track(_: number, item: Tab): string {
    return item.link;
  }

}
