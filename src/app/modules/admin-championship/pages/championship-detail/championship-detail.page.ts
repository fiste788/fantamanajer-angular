import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

import { ChampionshipService } from '@data/services';
import { UtilService } from '@app/services';
import { Championship, League } from '@data/types';
import { catchError, firstValueFrom, map, of } from 'rxjs';

@Component({
  styleUrls: ['./championship-detail.page.scss'],
  templateUrl: './championship-detail.page.html',
})
export class ChampionshipDetailPage implements OnInit {
  @ViewChild(NgForm) public championshipForm: NgForm;

  public championship: Championship;

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly route: ActivatedRoute,
    private readonly championshipService: ChampionshipService,
  ) {}

  public ngOnInit(): void {
    const c = UtilService.getSnapshotData<Championship>(this.route, 'championship');
    if (c) {
      this.championship = c;
    } else {
      this.championship = new Championship();
      this.championship.league = new League();
    }
  }

  public async save(): Promise<void> {
    return firstValueFrom(
      this.championshipService.save(this.championship).pipe(
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
