import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgForm, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, firstValueFrom, map, Observable } from 'rxjs';

import { getRouteData, getUnprocessableEntityErrors } from '@app/functions';
import { ApplicationService } from '@app/services';
import { AtLeast } from '@app/types';
import { LineupService } from '@data/services';
import { EmptyLineup, Lineup, Team } from '@data/types';
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
  ],
})
export class LineupLastPage {
  readonly #snackBar = inject(MatSnackBar);
  readonly #lineupService = inject(LineupService);
  readonly #app = inject(ApplicationService);

  protected readonly seasonEnded = this.#app.seasonEnded;
  protected readonly matchday = this.#app.currentMatchday;
  protected readonly team = toSignal(getRouteData<Team>('team'), { requireSync: true });
  protected readonly lineup = this.#lineupService.getLineupResource(this.team);
  protected readonly championship = computed(() => this.#app.requireCurrentTeam().championship);
  protected readonly editMode = computed(
    () => this.#app.requireCurrentTeam().id === this.team().id,
  );

  protected async save(lineup: EmptyLineup, lineupForm: NgForm): Promise<void> {
    if (lineupForm.valid) {
      // eslint-disable-next-line unicorn/no-null
      for (const value of lineup.dispositions) value.member_id = value.member?.id ?? null;
      const save$: Observable<AtLeast<Lineup, 'id'>> = lineup.id
        ? this.#lineupService.updateLineup(lineup as AtLeast<Lineup, 'id' | 'team'>)
        : this.#lineupService.createLineup(lineup);

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
