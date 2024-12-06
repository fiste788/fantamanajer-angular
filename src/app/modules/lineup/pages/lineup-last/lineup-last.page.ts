import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, combineLatest, firstValueFrom, map, Observable, switchMap } from 'rxjs';

import { getRouteData, getUnprocessableEntityErrors } from '@app/functions';
import { ApplicationService } from '@app/services';
import { AtLeast } from '@app/types';
import { LineupService } from '@data/services';
import { EmptyLineup, Lineup, Team } from '@data/types';
import { environment } from '@env';
import { LineupDetailComponent } from '@modules/lineup/components/lineup-detail/lineup-detail.component';
import { MemberAlreadySelectedValidator } from '@modules/lineup/components/lineup-detail/member-already-selected-validator.directive';
import { MatEmptyStateComponent } from '@shared/components/mat-empty-state';

@Component({
  styleUrl: './lineup-last.page.scss',
  templateUrl: './lineup-last.page.html',
  imports: [
    FormsModule,
    MemberAlreadySelectedValidator,
    LineupDetailComponent,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatEmptyStateComponent,
    AsyncPipe,
  ],
})
export class LineupLastPage {
  readonly #snackBar = inject(MatSnackBar);
  readonly #lineupService = inject(LineupService);
  protected readonly app = inject(ApplicationService);
  protected readonly lineup$ = this.loadData();
  protected editMode = false;
  protected benchs = environment.benchwarmersCount;
  protected captain = true;
  protected jolly = true;

  protected loadData(): Observable<EmptyLineup> {
    const team$ = getRouteData<Team>('team');

    return combineLatest([team$, this.app.requireTeam$]).pipe(
      map(([team, currentTeam]) => {
        this.benchs = currentTeam.championship.number_benchwarmers;
        this.editMode = currentTeam.id === team.id;
        this.captain = currentTeam.championship.captain;
        this.jolly = currentTeam.championship.jolly;

        return team;
      }),
      switchMap((team) => this.#lineupService.getLineup(team.id)),
    );
  }

  protected async save(lineup: EmptyLineup, lineupForm: NgForm): Promise<void> {
    if (lineupForm.valid) {
      // eslint-disable-next-line unicorn/no-null
      for (const value of lineup.dispositions) value.member_id = value.member?.id ?? null;
      const save$: Observable<AtLeast<Lineup, 'id'>> = lineup.id
        ? this.#lineupService.update(lineup as AtLeast<Lineup, 'id' | 'team'>)
        : this.#lineupService.create(lineup);

      return firstValueFrom(
        save$.pipe(
          map((response: Partial<Lineup>) => {
            if (response.id) {
              lineup.id = response.id;
            }
            this.#snackBar.open('Formazione salvata correttamente');
          }),
          catchError((err: unknown) => getUnprocessableEntityErrors(err, lineupForm)),
        ),
        { defaultValue: undefined },
      );
    }
    this.#snackBar.open('Si sono verificati errori di validazione');

    return undefined;
  }
}
