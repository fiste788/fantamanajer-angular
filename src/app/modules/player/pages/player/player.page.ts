import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, inject, input, linkedSignal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

import { distinctUntilChanged, switchMap } from 'rxjs';
import type { Observable } from 'rxjs';

import { filterNil } from '@app/functions';
import { AppService, ScrollService } from '@app/services';
import type { Member, Player, Rating } from '@data/interfaces';
import { RatingService } from '@data/services';
import { ParallaxHeaderComponent } from '@shared/components/parallax-header';

@Component({
  imports: [
    AsyncPipe,
    DecimalPipe,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    ParallaxHeaderComponent,
    RouterLink,
  ],
  templateUrl: './player.page.html',
  styleUrl: './player.page.scss',
})
export class PlayerPage {

  readonly #ratingService = inject(RatingService);
  readonly #scrollService = inject(ScrollService);
  protected readonly app = inject(AppService);

  public readonly player = input.required<Player>();

  protected readonly selectedMember = linkedSignal(() => this.player().members[0]!);

  protected ratings$ = this.getRatings(toObservable(this.selectedMember));

  protected readonly displayedColumns = [
    'matchday',
    'rating',
    'points',
    'goals',
    'goals_against',
    'assist',
    'penalities_scored',
    'penalities_taken',
    'regular',
    'yellow_card',
    'red_card',
    'quotation',
  ];

  protected getRatings(selectedMember$: Observable<Member>): Observable<Rating[]> {
    return selectedMember$.pipe(
      distinctUntilChanged(),
      filterNil(),
      switchMap(member => this.#ratingService.getRatings(member.id)),
    );
  }

  protected scrollTo(height: number): void {
    this.#scrollService.scrollTo(0, height - 300);
  }

  protected track(_: number, item: Member): number {
    return item.id;
  }

  protected trackRating(_: number, item: Rating): number {
    return item.id;
  }

}
