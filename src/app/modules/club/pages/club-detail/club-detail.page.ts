import { trigger } from '@angular/animations';
import { NgIf, AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';

import { getRouteData } from '@app/functions';
import { Club } from '@data/types';
import { enterDetailAnimation, routerTransition, tabTransition } from '@shared/animations';
import { StatePipe } from '@shared/pipes';
import { LayoutService } from 'src/app/layout/services';

import { ParallaxHeaderComponent } from '../../../../shared/components/parallax-header/parallax-header.component';

@Component({
  animations: [enterDetailAnimation, tabTransition, trigger('contextChange', routerTransition)],
  styleUrls: ['./club-detail.page.scss'],
  templateUrl: './club-detail.page.html',
  standalone: true,
  imports: [NgIf, ParallaxHeaderComponent, RouterOutlet, AsyncPipe, StatePipe],
})
export class ClubDetailPage {
  protected readonly club$: Observable<Club>;
  protected readonly tabs: Array<{ label: string; link: string }> = [
    { label: 'Giocatori', link: 'players' },
    { label: 'Attività', link: 'stream' },
  ];

  constructor(private readonly layoutService: LayoutService) {
    this.club$ = getRouteData('club');
  }

  protected scrollTo(height: number): void {
    this.layoutService.scrollTo(0, height - 300);
  }
}
