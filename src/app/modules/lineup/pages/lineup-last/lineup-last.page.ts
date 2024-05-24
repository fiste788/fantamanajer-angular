import { NgIf, AsyncPipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
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
import { LineupDetailComponent } from '@modules/lineup-common/components/lineup-detail/lineup-detail.component';
import { MemberAlreadySelectedValidator } from '@modules/lineup-common/components/lineup-detail/member-already-selected-validator.directive';
import { MatEmptyStateComponent } from '@shared/components/mat-empty-state';

@Component({
  styleUrl: './lineup-last.page.scss',
  templateUrl: './lineup-last.page.html',
  standalone: true,
  imports: [
    NgIf,
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
  @ViewChild(NgForm) public lineupForm?: NgForm;

  protected readonly lineup$: Observable<EmptyLineup>;
  protected editMode = false;
  protected benchs = environment.benchwarmersCount;

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly lineupService: LineupService,
    protected readonly app: ApplicationService,
  ) {
    this.lineup$ = this.loadData();
  }

  protected loadData(): Observable<EmptyLineup> {
    const team$ = getRouteData<Team>('team');

    return combineLatest([team$, this.app.requireTeam$]).pipe(
      map(([team, currentTeam]) => {
        this.benchs = currentTeam.championship.number_benchwarmers;
        this.editMode = currentTeam.id === team.id;

        return team;
      }),
      switchMap((team) => this.lineupService.getLineup(team.id)),
    );
  }

  protected async save(lineup: EmptyLineup): Promise<void> {
    if (this.lineupForm?.valid) {
      // eslint-disable-next-line unicorn/no-null
      for (const value of lineup.dispositions) value.member_id = value.member?.id ?? null;
      const save$: Observable<AtLeast<Lineup, 'id'>> = lineup.id
        ? this.lineupService.update(lineup as AtLeast<Lineup, 'id' | 'team'>)
        : this.lineupService.create(lineup);

      return firstValueFrom(
        save$.pipe(
          map((response: Partial<Lineup>) => {
            if (response.id) {
              lineup.id = response.id;
            }
            this.snackBar.open('Formazione salvata correttamente');
          }),
          catchError((err: unknown) => getUnprocessableEntityErrors(err, this.lineupForm)),
        ),
        { defaultValue: undefined },
      );
    }
    this.snackBar.open('Si sono verificati errori di validazione');

    return undefined;
  }
}
