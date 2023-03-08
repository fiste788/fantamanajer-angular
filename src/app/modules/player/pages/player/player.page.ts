import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, switchMap, distinctUntilChanged, tap } from 'rxjs/operators';

import { filterNil, getRouteData } from '@app/functions';
import { ApplicationService } from '@app/services';
import { RatingService } from '@data/services';
import { Member, Player, Rating } from '@data/types';
import { enterDetailAnimation, tableRowAnimation } from '@shared/animations';
import { LayoutService } from 'src/app/layout/services';

import { ParallaxHeaderComponent } from '../../../../shared/components/parallax-header/parallax-header.component';

@Component({
  animations: [tableRowAnimation, enterDetailAnimation],
  styleUrls: ['./player.page.scss'],
  templateUrl: './player.page.html',
  standalone: true,
  imports: [
    NgIf,
    ParallaxHeaderComponent,
    MatButtonModule,
    RouterLink,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    NgFor,
    MatOptionModule,
    MatTableModule,
    MatSortModule,
    MatTooltipModule,
    MatIconModule,
    MatProgressSpinnerModule,
    AsyncPipe,
  ],
})
export class PlayerPage {
  protected readonly player$: Observable<Player>;
  protected readonly ratings$: Observable<Array<Rating>>;
  protected readonly firstMember$: Observable<Member>;
  protected readonly selectedMember$: BehaviorSubject<Member | undefined>;
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

  constructor(
    private readonly ratingService: RatingService,
    private readonly layoutService: LayoutService,
    protected readonly app: ApplicationService,
  ) {
    this.player$ = getRouteData<Player>('player');
    this.selectedMember$ = new BehaviorSubject<Member | undefined>(undefined);
    this.firstMember$ = this.player$.pipe(
      map((p) => p.members[0]),
      filterNil(),
      tap((member) => this.selectedMember$.next(member)),
    );

    this.ratings$ = this.getRatings();
  }

  protected getRatings(): Observable<Array<Rating>> {
    return combineLatest([this.firstMember$, this.selectedMember$]).pipe(
      map(([first, selected]) => selected ?? first),
      distinctUntilChanged(),
      switchMap((member) => this.ratingService.getRatings(member.id)),
    );
  }

  protected track(_: number, item: Member): number {
    return item.id;
  }

  protected trackRating(_: number, item: Rating): number {
    return item.id;
  }

  protected scrollTo(height: number): void {
    this.layoutService.scrollTo(0, height - 300);
  }
}
