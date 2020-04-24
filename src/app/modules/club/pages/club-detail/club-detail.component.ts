import { trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

import { enterDetailAnimation, routerTransition, tabTransition } from '@shared/animations';
import { Club } from '@shared/models';

@Component({
  selector: 'fm-club-detail',
  templateUrl: './club-detail.component.html',
  styleUrls: ['./club-detail.component.scss'],
  animations: [
    enterDetailAnimation,
    tabTransition,
    trigger('contextChange', routerTransition)
  ]
})
export class ClubDetailComponent implements OnInit {
  club$: Observable<Club>;
  tabs: Array<{ label: string; link: string }> = [
    { label: 'Giocatori', link: 'players' },
    { label: 'Attività', link: 'stream' }
  ];

  constructor(private readonly route: ActivatedRoute) { }

  ngOnInit(): void {
    this.club$ = this.route.data.pipe(pluck('club'));
  }

  getState(outlet: RouterOutlet): string {
    return outlet.activatedRouteData.state;
  }
}
