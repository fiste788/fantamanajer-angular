import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, switchMap, distinctUntilChanged, tap } from 'rxjs/operators';

import { getRouteData } from '@app/functions';
import { ApplicationService } from '@app/services';
import { RatingService } from '@data/services';
import { Member, Player, Rating } from '@data/types';
import { enterDetailAnimation, tableRowAnimation } from '@shared/animations';
import { LayoutService } from 'src/app/layout/services';

@Component({
  animations: [tableRowAnimation, enterDetailAnimation],
  styleUrls: ['./player.page.scss'],
  templateUrl: './player.page.html',
})
export class PlayerPage {
  public player$: Observable<Player>;
  public ratings$: Observable<Array<Rating>>;
  public firstMember$: Observable<Member>;
  public selectedMember$: BehaviorSubject<Member | undefined>;
  public displayedColumns = [
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
    private readonly route: ActivatedRoute,
    private readonly ratingService: RatingService,
    private readonly layoutService: LayoutService,
    public app: ApplicationService,
  ) {
    this.player$ = getRouteData<Player>(this.route, 'player');
    this.selectedMember$ = new BehaviorSubject<Member | undefined>(undefined);
    this.firstMember$ = this.player$.pipe(
      map((p) => p.members[0]),
      tap((member) => this.selectedMember$?.next(member)),
    );

    this.ratings$ = this.getRatings();
  }

  public getRatings(): Observable<Array<Rating>> {
    return combineLatest([this.firstMember$, this.selectedMember$]).pipe(
      map(([first, selected]) => selected ?? first),
      distinctUntilChanged(),
      switchMap((member) => this.ratingService.getRatings(member.id)),
    );
  }

  public track(_: number, item: Member): number {
    return item.id;
  }

  public trackRating(_: number, item: Rating): number {
    return item.id;
  }

  public scrollTo(height: number): void {
    this.layoutService.scrollTo(0, height - 300, undefined);
  }
}
