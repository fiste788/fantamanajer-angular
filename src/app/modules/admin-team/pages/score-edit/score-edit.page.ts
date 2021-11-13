import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { catchError, firstValueFrom, map, Observable, switchMap } from 'rxjs';

import { UtilService } from '@app/services';
import { ScoreService } from '@data/services';
import { Lineup, Score, Team } from '@data/types';
import { LineupDetailComponent } from '@modules/lineup-common/components/lineup-detail/lineup-detail.component';

@Component({
  styleUrls: ['./score-edit.page.scss'],
  templateUrl: './score-edit.page.html',
})
export class ScoreEditPage {
  @ViewChild(NgForm) public scoreForm?: NgForm;
  @ViewChild(LineupDetailComponent) public lineupDetail?: LineupDetailComponent;

  public penality = false;
  public score$?: Observable<Score>;
  public scores$: Observable<Array<Score>>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly scoreService: ScoreService,
    private readonly snackBar: MatSnackBar,
  ) {
    this.scores$ = this.loadData();
  }

  public loadData(): Observable<Array<Score>> {
    return UtilService.getData<Team>(this.route, 'team').pipe(
      switchMap((team) => this.scoreService.getScoresByTeam(team.id)),
    );
  }

  public getScore(score: Score): void {
    this.score$ = this.scoreService.getScore(score.id, true);
  }

  public async save(score: Score): Promise<void> {
    if (this.lineupDetail) {
      score.lineup = this.lineupDetail.getLineup() as Lineup;
      return firstValueFrom(
        this.scoreService.update(score).pipe(
          map(() => {
            this.snackBar.open('Punteggio modificato', undefined, {
              duration: 3000,
            });
          }),
          catchError((err: unknown) =>
            UtilService.getUnprocessableEntityErrors(err, this.scoreForm),
          ),
        ),
        { defaultValue: undefined },
      );
    }
  }

  public track(_: number, item: Score): number {
    return item.id; // or item.id
  }
}
