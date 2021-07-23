import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

import { ChampionshipService } from '@data/services';
import { UtilService } from '@app/services';
import { Championship, League } from '@data/types';
import { catchError, firstValueFrom, map, Observable, of, pluck } from 'rxjs';
import { AtLeast, RecursivePartial } from '@app/types';
import { cardCreationAnimation } from '@shared/animations';

@Component({
  styleUrls: ['./championship-detail.page.scss'],
  templateUrl: './championship-detail.page.html',
  animations: [cardCreationAnimation],
})
export class ChampionshipDetailPage implements OnInit {
  @ViewChild(NgForm) public championshipForm: NgForm;

  public championship$: Observable<Partial<Championship>>;
  public league$: Observable<Partial<League>>;

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly route: ActivatedRoute,
    private readonly championshipService: ChampionshipService,
  ) {}

  public ngOnInit(): void {
    const championship = UtilService.getData<Championship>(this.route, 'championship');
    this.league$ = championship ? championship.pipe(pluck('league')) : of({});
    this.championship$ = championship ?? of({});
  }

  public async save(
    league: Partial<League>,
    championship: RecursivePartial<Championship>,
  ): Promise<void> {
    championship.league = league;
    const save: Observable<AtLeast<Championship, 'id'>> = championship.id
      ? this.championshipService.update(championship as AtLeast<Championship, 'id'>)
      : this.championshipService.create(championship);
    return firstValueFrom(
      save.pipe(
        map(() => {
          this.snackBar.open('Modifiche salvate', undefined, {
            duration: 3000,
          });
        }),
        catchError((err: unknown) => {
          UtilService.getUnprocessableEntityErrors(this.championshipForm, err);
          return of();
        }),
      ),
    );
  }

  public formatLabel(value: number): string {
    return `${value}%`;
  }
}
