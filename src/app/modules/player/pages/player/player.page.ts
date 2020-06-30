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
  animations: [
    tableRowAnimation,
    enterDetailAnimation,
  ],
  styleUrls: ['./player.page.scss'],
  templateUrl: './player.page.html',
})
export class PlayerPage implements OnInit {
  @ViewChild(MatSort) public sort: MatSort;

  public player$: Observable<Player>;
  public ratings$: Observable<Array<Rating>>;
  public selectedMember: Member;
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
    public app: ApplicationService,
  ) { }

  public ngOnInit(): void {
    this.load();
  }

  public load(): void {
    this.player$ = this.route.data.pipe(
      pluck('player'),
      tap((player: Player) => {
        this.selectedMember = player.members[0];
        this.seasonChange();
      }));
  }

  public seasonChange(): void {
    this.ratings$ = this.ratingService.getRatings(this.selectedMember.id);
  }

  public track(_: number, item: Member): number {
    return item.id;
  }
}
