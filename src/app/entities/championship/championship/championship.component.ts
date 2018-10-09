import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SharedService } from '../../../shared/shared.service';
import { MatTabGroup } from '@angular/material/tabs';
import { ApplicationService } from '../../../core/application.service';

@Component({
  selector: 'fm-championship',
  templateUrl: './championship.component.html',
  styleUrls: ['./championship.component.scss']
})
export class ChampionshipComponent implements OnInit, AfterViewInit {

  public tabs: { label: string; link: string }[] = [
    { label: 'Squadre', link: 'teams' },
    { label: 'Classifica', link: 'ranking' },
    { label: 'Giocatori liberi', link: 'members/free' },
    { label: 'Articoli', link: 'articles' },
    { label: 'Attività', link: 'stream' },
  ];
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  constructor(app: ApplicationService) {
    if (app.user.admin || app.team.admin) {
      this.tabs.push({ label: 'Admin', link: 'admin' });
    }
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.tabGroup.selectedIndex = this.tabs.findIndex((value) => location.href.includes(value.link));
  }

}
