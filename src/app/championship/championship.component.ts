import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'fm-championship',
  templateUrl: './championship.component.html',
  styleUrls: ['./championship.component.scss']
})
export class ChampionshipComponent implements OnInit {

  public tabs: any[];

  constructor(private sharedService: SharedService) {
    this.tabs = [];
  }

  ngOnInit() {
    this.sharedService.pageTitle = this.sharedService.currentChampionship.league.name;
    this.tabs = [
      {label: 'Squadre', link: 'teams'},
      {label: 'Classifica', link: 'ranking'},
      {label: 'Articoli', link: 'articles'},
      {label: 'Eventi', link: 'events'}
   ]
  }

}
