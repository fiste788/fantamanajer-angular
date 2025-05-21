import { Component, afterNextRender, inject, input } from '@angular/core';

import { ScrollService } from '@app/services';
import { Club, Tab } from '@data/types';
import { ParallaxHeaderComponent } from '@shared/components/parallax-header';
import { PrimaryTabComponent } from '@shared/components/primary-tab/primary-tab.component';

@Component({
  styleUrl: './club-detail.page.scss',
  templateUrl: './club-detail.page.html',
  imports: [ParallaxHeaderComponent, PrimaryTabComponent],
})
export class ClubDetailPage {
  readonly #scrollService = inject(ScrollService);
  protected club = input.required<Club>();
  protected placeholder?: string;

  protected readonly tabs: Array<Tab> = [
    { label: 'Giocatori', link: 'players' },
    { label: 'Attività', link: 'stream' },
  ];

  constructor() {
    afterNextRender(() => {
      const state = history.state as Record<string, string> | undefined;
      this.placeholder = state?.['img'];
    });
  }

  protected scrollTo(height: number): void {
    this.#scrollService.scrollTo(0, height - 300);
  }
}
