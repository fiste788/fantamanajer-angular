import { Component, computed, inject } from '@angular/core';
import type { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import type { Observable } from 'rxjs';

import { getRouteDataSignal, save } from '@app/functions';
import type { AtLeast } from '@app/interfaces';
import { AppService } from '@app/services';
import type { EmptyLineup, Lineup, Team } from '@data/interfaces';
import { LineupService } from '@data/services';
import { LineupDetailComponent } from '@modules/lineup/components/lineup-detail/lineup-detail.component';
import { MemberAlreadySelectedValidator } from '@modules/lineup/components/lineup-detail/member-already-selected-validator.directive';
import { MatEmptyStateComponent } from '@shared/components/mat-empty-state';

@Component({
  imports: [FormsModule, LineupDetailComponent, MatButtonModule, MatEmptyStateComponent, MatProgressSpinnerModule, MemberAlreadySelectedValidator],
  templateUrl: './lineup-last.page.html',
  styleUrl: './lineup-last.page.scss',
})
export class LineupLastPage {

  readonly #app = inject(AppService);
  readonly #lineupService = inject(LineupService);
  readonly #snackBar = inject(MatSnackBar);

  protected readonly championship = computed(() => this.#app.requireCurrentTeam().championship);
  protected readonly team = getRouteDataSignal<Team>('team');
  protected readonly editMode = computed(() => this.#app.requireCurrentTeam().id === this.team().id);
  protected readonly lineup = this.#lineupService.getLineupResource(this.team);
  protected readonly matchday = this.#app.currentMatchday;
  protected readonly seasonEnded = this.#app.seasonEnded;

  protected async save(lineup: EmptyLineup, lineupForm: NgForm): Promise<void> {
    if (lineupForm.valid) {
      for (const value of lineup.dispositions) value.member_id = value.member?.id ?? null;
      const save$: Observable<AtLeast<Lineup, 'id'>> = lineup.id
        ? this.#lineupService.updateLineup(lineup as AtLeast<Lineup, 'id' | 'team'>)
        : this.#lineupService.createLineup(lineup);

      return save(save$, undefined, this.#snackBar, {
        callback: (response) => {
          if (response.id) {
            lineup.id = response.id;
          }
        },
        form: lineupForm,
        message: 'Formazione salvata correttamente',
      });
    }
    this.#snackBar.open('Si sono verificati errori di validazione', undefined, { duration: 3000 });

    return undefined;
  }

}
