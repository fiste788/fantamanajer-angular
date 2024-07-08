import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
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
import { EmptyLineup, Lineup, Score, Team } from '@data/types';
import { LineupDetailComponent } from '@modules/lineup-common/components/lineup-detail/lineup-detail.component';

@Component({
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
  readonly #scoreService = inject(ScoreService);
  readonly #snackbar = inject(MatSnackBar);

  protected penality = false;
  protected score$?: Observable<Score>;
  protected readonly scores$ = this.loadData();

  protected loadData(): Observable<Array<Score>> {
    return getRouteData<Team>('team').pipe(
      switchMap((team) => this.#scoreService.getScoresByTeam(team.id)),
    );
  }

  protected getScore(score: Score): void {
    this.score$ = this.#scoreService.getScore(score.id, true);
  }

  protected async save(score: Score, scoreForm: NgForm, lineup?: EmptyLineup): Promise<void> {
    score.lineup = lineup as Lineup;

    return save(this.#scoreService.update(score), undefined, this.#snackbar, {
      message: 'Punteggio modificato',
      form: scoreForm,
    });
  }
}
