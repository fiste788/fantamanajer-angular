import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, firstValueFrom, map, Observable, switchMap } from 'rxjs';

import { getRouteData, getUnprocessableEntityErrors } from '@app/functions';
import { ScoreService } from '@data/services';
import { Lineup, Score, Team } from '@data/types';
import { LineupDetailComponent } from '@modules/lineup-common/components/lineup-detail/lineup-detail.component';

@Component({
  styleUrls: ['./score-edit.page.scss'],
  templateUrl: './score-edit.page.html',
})
export class ScoreEditPage {
  @ViewChild(NgForm) protected scoreForm?: NgForm;
  @ViewChild(LineupDetailComponent) protected lineupDetail?: LineupDetailComponent;

  protected penality = false;
  protected score$?: Observable<Score>;
  protected readonly scores$: Observable<Array<Score>>;

  constructor(private readonly scoreService: ScoreService, private readonly snackBar: MatSnackBar) {
    this.scores$ = this.loadData();
  }

  protected loadData(): Observable<Array<Score>> {
    return getRouteData<Team>('team').pipe(
      switchMap((team) => this.scoreService.getScoresByTeam(team.id)),
    );
  }

  protected getScore(score: Score): void {
    this.score$ = this.scoreService.getScore(score.id, true);
  }

  protected async save(score: Score): Promise<void> {
    if (this.lineupDetail) {
      score.lineup = this.lineupDetail.getLineup() as Lineup;

      return firstValueFrom(
        this.scoreService.update(score).pipe(
          map(() => {
            this.snackBar.open('Punteggio modificato');
          }),
          catchError((err: unknown) => getUnprocessableEntityErrors(err, this.scoreForm)),
        ),
        { defaultValue: undefined },
      );
    }

    return undefined;
  }

  protected track(_: number, item: Score): number {
    return item.id; // or item.id
  }
}
