import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApplicationService } from '@app/services';
import { Tab } from '@shared/models';

@Component({
  selector: 'fm-championship',
  templateUrl: './championship.component.html'
})
export class ChampionshipComponent implements OnInit {

  tabs: Array<Tab>;

  constructor(private readonly app: ApplicationService) {
  }

  ngOnInit(): void {
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

  getState(outlet: RouterOutlet): string {
    return outlet.isActivated ? outlet.activatedRouteData.state : '';
  }

  track(_: number, item: Tab): string {
    return item.link;
  }

}
