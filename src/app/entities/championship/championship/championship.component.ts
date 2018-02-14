import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SharedService } from 'app/shared/shared.service';
import { MatTabGroup } from '@angular/material';

@Component({
  selector: 'fm-championship',
  templateUrl: './championship.component.html',
  styleUrls: ['./championship.component.scss']
})
export class ChampionshipComponent implements OnInit, AfterViewInit {

  public tabs: any = [
    { label: 'Squadre', link: 'teams' },
    { label: 'Classifica', link: 'ranking' },
    { label: 'Giocatori liberi', link: 'members/free' },
    { label: 'Articoli', link: 'articles' },
    { label: 'Eventi', link: 'events' }
  ];
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.tabGroup.selectedIndex = this.tabs.findIndex((value) => location.href.includes(value.link));
  }

}
