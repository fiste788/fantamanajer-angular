import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { addVisibleClassOnDestroy } from '@app/functions';
import { Club } from '@data/types';
import { cardCreationAnimation } from '@shared/animations';
import { PlaceholderPipe, SrcsetPipe } from '@shared/pipes';

@Component({
  animations: [cardCreationAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./club-list.page.scss'],
  templateUrl: './club-list.page.html',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    MatCardModule,
    LazyLoadImageModule,
    MatButtonModule,
    RouterLink,
    MatProgressSpinnerModule,
    AsyncPipe,
    PlaceholderPipe,
    SrcsetPipe,
  ],
})
export class ClubListPage {
  @Input({ required: true }) protected clubs!: Array<Club>;

  constructor(private readonly router: Router) {
    // this.clubs$ = this.route.getClubs();
    addVisibleClassOnDestroy(cardCreationAnimation);
  }

  public track(_: number, club: Club): number {
    return club.id;
  }

  protected async nav(segments: Array<string>, el: HTMLImageElement): Promise<void> {
    // add class to assign view-transition-name
    // const ref = new ElementRef(el) as ElementRef<HTMLElement>;
    el.classList.add('active');
    // startViewTransition, navigate to detail route and animate the state change
    await this.router.navigate(segments);
  }
}
