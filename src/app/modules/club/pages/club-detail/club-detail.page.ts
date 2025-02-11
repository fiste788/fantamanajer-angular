import { Component, afterNextRender, inject, input } from '@angular/core';

import { ScrollService } from '@app/services';
import { Club, Tab } from '@data/types';
import { ParallaxHeaderComponent } from '@shared/components/parallax-header';
import { PrimaryTabComponent } from '@shared/components/primary-tab/primary-tab.component';

@Component({
  animations: [],
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.placeholder = history.state?.img as string;
    });
  }

  protected scrollTo(height: number): void {
    this.#scrollService.scrollTo(0, height - 300);
  }
}
