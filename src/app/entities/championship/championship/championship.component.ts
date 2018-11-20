import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MatTabGroup } from '@angular/material/tabs';
import { ApplicationService } from '../../../core/application.service';
import { tabTransition } from 'app/shared/animations/tab-transition.animation';

@Component({
  selector: 'fm-championship',
  templateUrl: './championship.component.html',
  styleUrls: ['./championship.component.scss'],
  animations: [tabTransition]
})
export class ChampionshipComponent implements AfterViewInit {

  public tabs: { label: string; link: string }[] = [
    { label: 'Squadre', link: 'teams' },
    { label: 'Classifica', link: 'ranking' },
    { label: 'Giocatori liberi', link: 'members/free' },
    { label: 'Articoli', link: 'articles' },
    { label: 'Attività', link: 'stream' },
  ];
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  constructor(app: ApplicationService, private router: Router) {
    if (app.user.admin || app.team.admin) {
      this.tabs.push({ label: 'Admin', link: 'admin' });
    }
    this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.selectTabFromUrl();
      }
    });
  }

  selectTabFromUrl() {
    if (this.tabGroup) {
      this.tabGroup.selectedIndex = this.tabs.findIndex((value) => location.href.includes(value.link));
    }
  }

  ngAfterViewInit() {
    this.selectTabFromUrl();
  }

  getState(outlet) {
    // Changing the activatedRouteData.state triggers the animation
    return outlet.activatedRouteData.state;
  }

}
