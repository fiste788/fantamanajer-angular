import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { pluck, tap } from 'rxjs/operators';

import { RatingService } from '@app/http';
import { ApplicationService } from '@app/services';
import { enterDetailAnimation, tableRowAnimation } from '@shared/animations';
import { Member, Player, Rating } from '@shared/models';

@Component({
  selector: 'fm-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  animations: [
    tableRowAnimation,
    enterDetailAnimation
  ]
})
export class PlayerComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;

  player$: Observable<Player>;
  ratings$: Observable<Array<Rating>>;
  selectedMember: Member;
  displayedColumns = [
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
    'quotation'
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly ratingService: RatingService,
    public app: ApplicationService
  ) { }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.player$ = this.route.data.pipe(
      pluck('player'),
      tap((player: Player) => {
        this.selectedMember = player.members[0];
        this.seasonChange();
      }));
  }

  seasonChange(): void {
    this.ratings$ = this.ratingService.getRatings(this.selectedMember.id);
  }

  track(_: number, item: Member): number {
    return item.id;
  }
}
