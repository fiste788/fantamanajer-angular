import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { defaultIfEmpty, map, Observable, switchMap } from 'rxjs';

import { getRouteData } from '@app/functions';
import { save } from '@app/functions/save.function';
import { AtLeast, RecursivePartial } from '@app/types';
import { ChampionshipService } from '@data/services';
import { Championship, League } from '@data/types';

@Component({
  styleUrl: './championship-detail.page.scss',
  templateUrl: './championship-detail.page.html',
  imports: [
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatButtonModule,
    AsyncPipe,
  ],
})
export class ChampionshipDetailPage {
  readonly #championshipService = inject(ChampionshipService);
  readonly #snackbar = inject(MatSnackBar);

  protected readonly championship$ = getRouteData<Championship>('championship').pipe(
    switchMap((c) => this.#championshipService.getChampionship(c.id)),
    defaultIfEmpty({} as Partial<Championship>),
  );

  protected readonly league$ = this.championship$.pipe(
    map((c) => c.league ?? ({} as Partial<League>)),
  );

  protected async save(
    league: Partial<League>,
    championship: RecursivePartial<Championship>,
    championshipForm: NgForm,
  ): Promise<void> {
    championship.league = league;
    const save$: Observable<AtLeast<Championship, 'id'>> = championship.id
      ? this.#championshipService.update(championship as AtLeast<Championship, 'id'>)
      : this.#championshipService.create(championship);

    return save(save$, undefined, this.#snackbar, {
      message: 'Modifiche salvate',
      form: championshipForm,
    });
  }

  protected formatLabel(value: number): string {
    return `${value}%`;
  }
}
