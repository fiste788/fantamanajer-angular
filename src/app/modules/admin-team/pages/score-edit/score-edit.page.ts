import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, switchMap } from 'rxjs';

import { getRouteData } from '@app/functions';
import { save } from '@app/functions/save.function';
import { ScoreService } from '@data/services';
import { Lineup, Score, Team } from '@data/types';
import { LineupDetailComponent } from '@modules/lineup-common/components/lineup-detail/lineup-detail.component';

@Component({
  styleUrls: ['./score-edit.page.scss'],
  templateUrl: './score-edit.page.html',
  standalone: true,
  imports: [
    NgIf,
    MatFormFieldModule,
    MatSelectModule,
    NgFor,
    MatOptionModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatSlideToggleModule,
    LineupDetailComponent,
    MatButtonModule,
    MatProgressSpinnerModule,
    AsyncPipe,
  ],
})
export class ScoreEditPage {
  @ViewChild(NgForm) protected scoreForm?: NgForm;
  @ViewChild(LineupDetailComponent) protected lineupDetail?: LineupDetailComponent;

  protected penality = false;
  protected score$?: Observable<Score>;
  protected readonly scores$: Observable<Array<Score>>;

  constructor(private readonly scoreService: ScoreService, private readonly snackbar: MatSnackBar) {
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

      return save(this.scoreService.update(score), undefined, this.snackbar, {
        message: 'Punteggio modificato',
        form: this.scoreForm,
      });
    }

    return undefined;
  }

  protected track(_: number, item: Score): number {
    return item.id; // or item.id
  }
}
