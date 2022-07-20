import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, firstValueFrom, map, Observable } from 'rxjs';

import { getRouteData, getUnprocessableEntityErrors } from '@app/functions';
import { AtLeast, RecursivePartial } from '@app/types';
import { TeamService } from '@data/services';
import { Championship, Team } from '@data/types';

@Component({
  styleUrls: ['./add-team.page.scss'],
  templateUrl: './add-team.page.html',
})
export class AddTeamPage {
  @ViewChild(NgForm) protected teamForm?: NgForm;

  protected readonly team$: Observable<Partial<Team>>;
  protected email = '';

  constructor(
    private readonly teamService: TeamService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
  ) {
    this.team$ = this.loadData();
  }

  protected loadData(): Observable<{ championship_id: number }> {
    return getRouteData<Championship>('championship').pipe(map((t) => ({ championship_id: t.id })));
  }

  protected async save(team: RecursivePartial<Team>): Promise<boolean> {
    team.user = { email: this.email };
    const save$: Observable<AtLeast<Team, 'id'>> = team.id
      ? this.teamService.update(team as AtLeast<Team, 'id'>)
      : this.teamService.create(team);
    return firstValueFrom(
      save$.pipe(
        map(async (response) => {
          this.snackBar.open('Modifiche salvate');
          return this.router.navigateByUrl(`/teams/${response.id}/admin/members`);
        }),
        catchError((err: unknown) => getUnprocessableEntityErrors(err, this.teamForm)),
      ),
      { defaultValue: false },
    );
  }
}
