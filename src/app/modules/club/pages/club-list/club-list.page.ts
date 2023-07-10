import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { Observable } from 'rxjs';

import { addVisibleClassOnDestroy } from '@app/functions';
import { ClubService } from '@data/services';
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
  protected readonly clubs$?: Observable<Array<Club>>;

  constructor(private readonly clubService: ClubService) {
    this.clubs$ = this.clubService.getClubs();
    addVisibleClassOnDestroy(cardCreationAnimation);
  }

  public track(_: number, club: Club): number {
    return club.id;
  }
}
