import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { defaultIfEmpty, map, Observable } from 'rxjs';

import { getRouteData } from '@app/functions';
import { save } from '@app/functions/save.function';
import { AtLeast, RecursivePartial } from '@app/types';
import { ChampionshipService } from '@data/services';
import { Championship, League } from '@data/types';
import { cardCreationAnimation } from '@shared/animations';

@Component({
  styleUrls: ['./championship-detail.page.scss'],
  templateUrl: './championship-detail.page.html',
  animations: [cardCreationAnimation],
})
export class ChampionshipDetailPage {
  @ViewChild(NgForm) protected championshipForm?: NgForm;

  protected readonly championship$: Observable<Partial<Championship>>;
  protected readonly league$: Observable<Partial<League>>;

  constructor(private readonly championshipService: ChampionshipService) {
    this.championship$ = getRouteData<Championship>('championship').pipe(defaultIfEmpty({}));
    this.league$ = this.championship$.pipe(map((c) => c.league ?? {}));
  }

  protected async save(
    league: Partial<League>,
    championship: RecursivePartial<Championship>,
  ): Promise<void> {
    championship.league = league;
    const save$: Observable<AtLeast<Championship, 'id'>> = championship.id
      ? this.championshipService.update(championship as AtLeast<Championship, 'id'>)
      : this.championshipService.create(championship);

    return save(save$, undefined, { message: 'Modifiche salvate', form: this.championshipForm });
  }

  protected formatLabel(value: number): string {
    return `${value}%`;
  }
}
