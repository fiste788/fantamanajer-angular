import { Component, Input, inject } from '@angular/core';

import { Club } from '@data/types';
import { ParallaxHeaderComponent } from '@shared/components/parallax-header';
import { ToolbarTabComponent } from '@shared/components/toolbar-tab/toolbar-tab.component';
import { LayoutService } from 'src/app/layout/services';

@Component({
  animations: [],
  styleUrl: './club-detail.page.scss',
  templateUrl: './club-detail.page.html',
  standalone: true,
  imports: [ParallaxHeaderComponent, ToolbarTabComponent],
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
