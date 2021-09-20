import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { catchError, firstValueFrom, map, Observable, of, switchMap, tap } from 'rxjs';

import { LineupService } from '@data/services';
import { ApplicationService, UtilService } from '@app/services';
import { EmptyLineup, Lineup, Team } from '@data/types';
import { AtLeast } from '@app/types';
import { environment } from '@env';

@Component({
  styleUrls: ['./lineup-last.page.scss'],
  templateUrl: './lineup-last.page.html',
})
export class LineupLastPage implements OnInit {
  @ViewChild(NgForm) public lineupForm: NgForm;

  public lineup$: Observable<EmptyLineup>;
  public editMode = false;
  public teamId: number;
  public benchs: number;

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly lineupService: LineupService,
    private readonly route: ActivatedRoute,
    public app: ApplicationService,
  ) {}

  public ngOnInit(): void {
    this.lineup$ = UtilService.getData<Team>(this.route, 'team').pipe(
      tap((team) => (this.teamId = team.id)),
      switchMap(() => this.app.teamChange$),
      tap(
        (currentTeam) =>
          (this.benchs = currentTeam
            ? currentTeam.championship.number_benchwarmers
            : environment.benchwarmersCount),
      ),
      tap((currentTeam) => (this.editMode = currentTeam?.id === this.teamId)),
      switchMap(() => this.lineupService.getLineup(this.teamId)),
    );
  }

  public async save(lineup: EmptyLineup): Promise<void> {
    if (this.lineupForm.valid) {
      // eslint-disable-next-line no-null/no-null
      lineup.dispositions.forEach((value) => (value.member_id = value.member?.id ?? null));
      const save: Observable<AtLeast<Lineup, 'id'>> = lineup.id
        ? this.lineupService.update(lineup as AtLeast<Lineup, 'id' | 'team'>)
        : this.lineupService.create(lineup);
      return firstValueFrom(
        save.pipe(
          map((response: AtLeast<Lineup, 'id'>) => {
            lineup.id = response.id;
            this.snackBar.open('Formazione salvata correttamente', undefined, {
              duration: 3000,
            });
          }),
          catchError((err: unknown) => {
            UtilService.getUnprocessableEntityErrors(this.lineupForm, err);
            return of();
          }),
        ),
        { defaultValue: undefined },
      );
    } else {
      this.snackBar.open('Si sono verificati errori di validazione', undefined, {
        duration: 3000,
      });
    }
  }
}
