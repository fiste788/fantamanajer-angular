import { trigger } from '@angular/animations';
import { NgIf, AsyncPipe } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Club } from '@data/types';
import { enterDetailAnimation, routerTransition, tabTransition } from '@shared/animations';
import { ParallaxHeaderComponent } from '@shared/components';
import { StatePipe } from '@shared/pipes';
import { LayoutService } from 'src/app/layout/services';

@Component({
  animations: [enterDetailAnimation, tabTransition, trigger('contextChange', routerTransition)],
  styleUrls: ['./club-detail.page.scss'],
  templateUrl: './club-detail.page.html',
  standalone: true,
  imports: [NgIf, ParallaxHeaderComponent, RouterOutlet, AsyncPipe, StatePipe],
})
export class ClubDetailPage {
  @Input({ required: true }) protected club!: Club;

  protected readonly tabs: Array<{ label: string; link: string }> = [
    { label: 'Giocatori', link: 'players' },
    { label: 'Attività', link: 'stream' },
  ];

  private readonly layoutService = inject(LayoutService);

  protected scrollTo(height: number): void {
    this.layoutService.scrollTo(0, height - 300);
  }
}
