import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { catchError, defaultIfEmpty, firstValueFrom, map, Observable } from 'rxjs';

import { getRouteData, getUnprocessableEntityErrors } from '@app/functions';
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
  @ViewChild(NgForm) public championshipForm?: NgForm;

  public championship$: Observable<Partial<Championship>>;
  public league$: Observable<Partial<League>>;

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly route: ActivatedRoute,
    private readonly championshipService: ChampionshipService,
  ) {
    this.championship$ = getRouteData<Championship>(this.route, 'championship').pipe(
      defaultIfEmpty({}),
    );
    this.league$ = this.championship$.pipe(map((c) => c.league || {}));
  }

  public async save(
    league: Partial<League>,
    championship: RecursivePartial<Championship>,
  ): Promise<void> {
    championship.league = league;
    const save$: Observable<AtLeast<Championship, 'id'>> = championship.id
      ? this.championshipService.update(championship as AtLeast<Championship, 'id'>)
      : this.championshipService.create(championship);
    return firstValueFrom(
      save$.pipe(
        map(() => {
          this.snackBar.open('Modifiche salvate', undefined, {
            duration: 3000,
          });
        }),
        catchError((err: unknown) => getUnprocessableEntityErrors(err, this.championshipForm)),
      ),
      { defaultValue: undefined },
    );
  }

  public formatLabel(value: number): string {
    return `${value}%`;
  }
}
