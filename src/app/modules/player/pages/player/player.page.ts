import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { Component, OnInit, input } from '@angular/core';
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
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap, distinctUntilChanged } from 'rxjs/operators';

import { addVisibleClassOnDestroy, filterNil } from '@app/functions';
import { ApplicationService } from '@app/services';
import { RatingService } from '@data/services';
import { Member, Player, Rating } from '@data/types';
import { enterDetailAnimation, tableRowAnimation } from '@shared/animations';
import { ParallaxHeaderComponent } from '@shared/components/parallax-header';
import { LayoutService } from 'src/app/layout/services';

@Component({
  animations: [tableRowAnimation, enterDetailAnimation],
  styleUrl: './player.page.scss',
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
    MatCardModule,
  ],
})
export class PlayerPage implements OnInit {
  protected readonly player = input.required<Player>();
  protected firstMember?: Member;
  protected ratings$?: Observable<Array<Rating>>;
  protected readonly selectedMember$ = new BehaviorSubject<Member | undefined>(undefined);
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
    addVisibleClassOnDestroy(tableRowAnimation);
  }

  public ngOnInit(): void {
    [this.firstMember] = this.player().members;
    this.selectedMember$.next(this.firstMember);

    this.ratings$ = this.getRatings();
  }

  protected getRatings(): Observable<Array<Rating>> {
    return this.selectedMember$.pipe(
      map((selected) => selected ?? this.firstMember),
      distinctUntilChanged(),
      filterNil(),
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
