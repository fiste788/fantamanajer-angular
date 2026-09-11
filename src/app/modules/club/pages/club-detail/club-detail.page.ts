import { afterNextRender, Component, inject, input } from '@angular/core';

import { ScrollService, WINDOW } from '@app/services';
import type { Club, Tab } from '@data/interfaces';
import { ParallaxHeaderComponent } from '@shared/components/parallax-header';
import { PrimaryTabComponent } from '@shared/components/primary-tab/primary-tab.component';

@Component({
  imports: [ParallaxHeaderComponent, PrimaryTabComponent],
  templateUrl: './club-detail.page.html',
  styleUrl: './club-detail.page.scss',
})
export class ClubDetailPage {

  readonly #scrollService = inject(ScrollService);
  readonly #window = inject<Window>(WINDOW);

  public readonly club = input.required<Club>();

  protected placeholder?: string | undefined;

  protected readonly tabs: Tab[] = [
    { label: 'Giocatori', link: 'players' },
    { label: 'Attività', link: 'stream' },
  ];

  constructor() {
    afterNextRender(() => {
      const state = this.#window.history.state as Record<string, string> | undefined;
      this.placeholder = state?.['img'];
    });
  }

  protected scrollTo(height: number): void {
    this.#scrollService.scrollTo(0, height - 300);
  }

}
