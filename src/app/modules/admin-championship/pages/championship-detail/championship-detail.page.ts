import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import type { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';

import { defaultIfEmpty, map, switchMap } from 'rxjs';
import type { Observable } from 'rxjs';

import { getRouteData } from '@app/functions';
import { save } from '@app/functions/save.function';
import type { AtLeast, RecursivePartial } from '@app/interfaces';
import type { Championship, League } from '@data/interfaces';
import { ChampionshipService } from '@data/services';

// Definiamo un'istanza reale di default, senza ingannare TypeScript
const createEmptyChampionship = (): Partial<Championship> => ({});
const createEmptyLeague = (): Partial<League> => ({});

@Component({
  imports: [AsyncPipe, FormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSlideToggleModule],
  templateUrl: './championship-detail.page.html',
  styleUrl: './championship-detail.page.scss',
})
export class ChampionshipDetailPage {

  readonly #championshipService = inject(ChampionshipService);
  readonly #snackbar = inject(MatSnackBar);

  // Il flusso ora sa che può emettere un Championship OPPURE null
  protected readonly championship$ = getRouteData<Championship>('championship').pipe(
    switchMap(c => this.#championshipService.getChampionship(c.id)),
    defaultIfEmpty(createEmptyChampionship()),
  );
  protected readonly league$ = this.championship$.pipe(map(c => c.league ?? createEmptyLeague()));

  protected formatLabel(value: number): string {
    return `${value}%`;
  }

  protected async save(league: Partial<League>, championship: RecursivePartial<Championship>, championshipForm: NgForm): Promise<void> {
    championship.league = league;
    const save$: Observable<AtLeast<Championship, 'id'>> = championship.id
      ? this.#championshipService.update(championship as AtLeast<Championship, 'id'>)
      : this.#championshipService.create(championship);

    return save(save$, undefined, this.#snackbar, {
      form: championshipForm,
      message: 'Modifiche salvate',
    });
  }

}
