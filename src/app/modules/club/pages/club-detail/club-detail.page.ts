import { trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { enterDetailAnimation, routerTransition, tabTransition } from '@shared/animations';
import { Club } from '@data/types';
import { UtilService } from '@app/services';

@Component({
  animations: [enterDetailAnimation, tabTransition, trigger('contextChange', routerTransition)],
  styleUrls: ['./club-detail.page.scss'],
  templateUrl: './club-detail.page.html',
})
export class ClubDetailPage {
  public club$: Observable<Club>;
  public tabs: Array<{ label: string; link: string }> = [
    { label: 'Giocatori', link: 'players' },
    { label: 'Attività', link: 'stream' },
  ];

  constructor(private readonly route: ActivatedRoute) {
    this.club$ = UtilService.getData(this.route, 'club');
  }
}
