import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { catchError, combineLatest, firstValueFrom, map, Observable, switchMap } from 'rxjs';

import { ApplicationService, UtilService } from '@app/services';
import { AtLeast } from '@app/types';
import { LineupService } from '@data/services';
import { EmptyLineup, Lineup, Team } from '@data/types';
import { environment } from '@env';

@Component({
  styleUrls: ['./lineup-last.page.scss'],
  templateUrl: './lineup-last.page.html',
})
export class LineupLastPage {
  @ViewChild(NgForm) public lineupForm?: NgForm;

  public lineup$: Observable<EmptyLineup>;
  public editMode = false;
  public benchs = environment.benchwarmersCount;

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly lineupService: LineupService,
    private readonly route: ActivatedRoute,
    public app: ApplicationService,
  ) {
    this.lineup$ = this.loadData();
  }

  public loadData(): Observable<EmptyLineup> {
    const team$ = UtilService.getData<Team>(this.route, 'team');
    return combineLatest([team$, this.app.requireTeam$]).pipe(
      map(([team, currentTeam]) => {
        this.benchs = currentTeam.championship.number_benchwarmers;
        this.editMode = currentTeam.id === team.id;
        return team;
      }),
      switchMap((team) => this.lineupService.getLineup(team.id)),
    );
  }

  public async save(lineup: EmptyLineup): Promise<void> {
    if (this.lineupForm?.valid) {
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
          catchError((err: unknown) =>
            UtilService.getUnprocessableEntityErrors(err, this.lineupForm),
          ),
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
