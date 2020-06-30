import { trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

import { enterDetailAnimation, routerTransition, tabTransition } from '@shared/animations';
import { Club } from '@shared/models';

@Component({
  animations: [
    enterDetailAnimation,
    tabTransition,
    trigger('contextChange', routerTransition),
  ],
  styleUrls: ['./club-detail.page.scss'],
  templateUrl: './club-detail.page.html',
})
export class ClubDetailPage implements OnInit {
  public club$: Observable<Club>;
  public tabs: Array<{ label: string; link: string }> = [
    { label: 'Giocatori', link: 'players' },
    { label: 'Attività', link: 'stream' },
  ];

  constructor(private readonly route: ActivatedRoute) { }

  public ngOnInit(): void {
    this.club$ = this.route.data.pipe(pluck('club'));
  }
}
