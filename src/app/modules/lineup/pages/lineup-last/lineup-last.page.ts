import { Component, computed, inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

import { getRouteDataSignal, save } from '@app/functions';
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
  protected readonly team = getRouteDataSignal<Team>('team');
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

      return save(save$, undefined, this.#snackBar, {
        message: 'Formazione salvata correttamente',
        form: lineupForm,
        callback: (response) => {
          if (response.id) {
            lineup.id = response.id;
          }
        },
      });
    }
    this.#snackBar.open('Si sono verificati errori di validazione', undefined, { duration: 3000 });

    return undefined;
  }
}
