import { NgIf, AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { defaultIfEmpty, map, Observable } from 'rxjs';

import { addVisibleClassOnDestroy, getRouteData } from '@app/functions';
import { save } from '@app/functions/save.function';
import { AtLeast, RecursivePartial } from '@app/types';
import { ChampionshipService } from '@data/services';
import { Championship, League } from '@data/types';
import { cardCreationAnimation } from '@shared/animations';

@Component({
  styleUrl: './championship-detail.page.scss',
  templateUrl: './championship-detail.page.html',
  animations: [cardCreationAnimation],
  standalone: true,
  imports: [
    NgIf,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatButtonModule,
    AsyncPipe,
  ],
})
export class ChampionshipDetailPage {
  protected readonly championship$: Observable<Partial<Championship>>;
  protected readonly league$: Observable<Partial<League>>;

  constructor(
    private readonly championshipService: ChampionshipService,
    private readonly snackbar: MatSnackBar,
  ) {
    this.championship$ = getRouteData<Championship>('championship').pipe(defaultIfEmpty({}));
    this.league$ = this.championship$.pipe(map((c) => c.league ?? {}));
    addVisibleClassOnDestroy(cardCreationAnimation);
  }

  protected async save(
    league: Partial<League>,
    championship: RecursivePartial<Championship>,
    championshipForm: NgForm,
  ): Promise<void> {
    championship.league = league;
    const save$: Observable<AtLeast<Championship, 'id'>> = championship.id
      ? this.championshipService.update(championship as AtLeast<Championship, 'id'>)
      : this.championshipService.create(championship);

    return save(save$, undefined, this.snackbar, {
      message: 'Modifiche salvate',
      form: championshipForm,
    });
  }

  protected formatLabel(value: number): string {
    return `${value}%`;
  }
}
