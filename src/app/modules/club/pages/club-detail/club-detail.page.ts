import { trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

import { enterDetailAnimation, routerTransition, tabTransition } from '@shared/animations';
import { Club } from '@shared/models';

@Component({
  templateUrl: './club-detail.page.html',
  styleUrls: ['./club-detail.page.scss'],
  animations: [
    enterDetailAnimation,
    tabTransition,
    trigger('contextChange', routerTransition)
  ]
})
export class ClubDetailPage implements OnInit {
  club$: Observable<Club>;
  tabs: Array<{ label: string; link: string }> = [
    { label: 'Giocatori', link: 'players' },
    { label: 'Attività', link: 'stream' }
  ];

  constructor(private readonly route: ActivatedRoute) { }

  ngOnInit(): void {
    this.club$ = this.route.data.pipe(pluck('club'));
  }
}
