import { trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { getRouteData } from '@app/functions';
import { Club } from '@data/types';
import { enterDetailAnimation, routerTransition, tabTransition } from '@shared/animations';
import { LayoutService } from 'src/app/layout/services';

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

  constructor(private readonly layoutService: LayoutService) {
    this.club$ = getRouteData('club');
  }

  public scrollTo(height: number): void {
    this.layoutService.scrollTo(0, height - 300, undefined);
  }
}
