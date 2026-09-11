import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import type { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';

import { switchMap } from 'rxjs';
import type { Observable } from 'rxjs';

import { getRouteData } from '@app/functions';
import { save } from '@app/functions/save.function';
import type { EmptyLineup, Lineup, Score, Team } from '@data/interfaces';
import { ScoreService } from '@data/services';
import { LineupDetailComponent } from '@modules/lineup/components/lineup-detail/lineup-detail.component';
import { MemberAlreadySelectedValidator } from '@modules/lineup/components/lineup-detail/member-already-selected-validator.directive';

@Component({
  imports: [
    AsyncPipe,
    FormsModule,
    LineupDetailComponent,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSlideToggleModule,
    MemberAlreadySelectedValidator,
  ],
  templateUrl: './score-edit.page.html',
})
export class ScoreEditPage {

  readonly #scoreService = inject(ScoreService);
  readonly #snackbar = inject(MatSnackBar);

  protected penality = false;
  protected score$?: Observable<Score>;

  protected readonly selectedScore = signal<Score | undefined>(undefined);
  protected readonly score = this.#scoreService.getScoreResourceById(this.selectedScore, true);
  protected readonly scores$ = this.loadData();

  protected loadData(): Observable<Score[]> {
    return getRouteData<Team>('team').pipe(switchMap(team => this.#scoreService.getScoresByTeam(team.id)));
  }

  protected async save(score: Score, scoreForm: NgForm, lineup?: EmptyLineup): Promise<void> {
    score.lineup = lineup as Lineup;

    return save(this.#scoreService.updateScore(score), undefined, this.#snackbar, {
      form: scoreForm,
      message: 'Punteggio modificato',
    });
  }

}
