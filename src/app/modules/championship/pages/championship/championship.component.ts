import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApplicationService } from '@app/core/services/application.service';

@Component({
  selector: 'fm-championship',
  templateUrl: './championship.component.html'
})
export class ChampionshipComponent implements OnInit {

  public tabs: { label: string; link: string }[];

  constructor(private app: ApplicationService) {
  }

  ngOnInit() {
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

  getState(outlet: RouterOutlet) {
    return outlet.activatedRouteData.state;
  }

}
