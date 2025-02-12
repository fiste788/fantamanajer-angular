import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, input, inject, linkedSignal } from '@angular/core';
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
import { Observable, switchMap, distinctUntilChanged } from 'rxjs';

import { addVisibleClassOnDestroy, filterNil } from '@app/functions';
import { ApplicationService, ScrollService } from '@app/services';
import { RatingService } from '@data/services';
import { Member, Player, Rating } from '@data/types';
import { enterDetailAnimation, tableRowAnimation } from '@shared/animations';
import { ParallaxHeaderComponent } from '@shared/components/parallax-header';

@Component({
  animations: [tableRowAnimation, enterDetailAnimation],
  styleUrl: './player.page.scss',
  templateUrl: './player.page.html',
  imports: [
    ParallaxHeaderComponent,
    MatButtonModule,
    RouterLink,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatOptionModule,
    MatTableModule,
    MatSortModule,
    MatTooltipModule,
    MatIconModule,
    MatProgressSpinnerModule,
    AsyncPipe,
    MatCardModule,
    DecimalPipe,
  ],
})
export class PlayerPage {
  readonly #ratingService = inject(RatingService);
  readonly #scrollService = inject(ScrollService);

  protected readonly app = inject(ApplicationService);
  protected readonly player = input.required<Player>();
  protected selectedMember = linkedSignal(() => this.player().members[0]!);
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

  constructor() {
    addVisibleClassOnDestroy(tableRowAnimation);
  }

  protected getRatings(selectedMember$: Observable<Member>): Observable<Array<Rating>> {
    return selectedMember$.pipe(
      distinctUntilChanged(),
      filterNil(),
      switchMap((member) => this.#ratingService.getRatings(member.id)),
    );
  }

  protected track(_: number, item: Member): number {
    return item.id;
  }

  protected trackRating(_: number, item: Rating): number {
    return item.id;
  }

  protected scrollTo(height: number): void {
    this.#scrollService.scrollTo(0, height - 300);
  }
}
