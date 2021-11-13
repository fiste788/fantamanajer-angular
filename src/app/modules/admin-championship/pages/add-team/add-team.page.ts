import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, firstValueFrom, map, Observable } from 'rxjs';

import { UtilService } from '@app/services';
import { AtLeast, RecursivePartial } from '@app/types';
import { TeamService } from '@data/services';
import { Championship, Team } from '@data/types';

@Component({
  styleUrls: ['./add-team.page.scss'],
  templateUrl: './add-team.page.html',
})
export class AddTeamPage {
  @ViewChild(NgForm) public teamForm?: NgForm;

  public team$: Observable<Partial<Team>>;
  public email = '';

  constructor(
    private readonly teamService: TeamService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    this.team$ = this.loadData();
  }

  public loadData(): Observable<{ championship_id: number }> {
    return UtilService.getData<Championship>(this.route, 'championship').pipe(
      map((t) => ({ championship_id: t.id })),
    );
  }

  public async save(team: RecursivePartial<Team>): Promise<void> {
    team.user = { email: this.email };
    const save: Observable<AtLeast<Team, 'id'>> = team.id
      ? this.teamService.update(team as AtLeast<Team, 'id'>)
      : this.teamService.create(team);
    return firstValueFrom(
      save.pipe(
        map((response) => {
          this.snackBar.open('Modifiche salvate', undefined, {
            duration: 3000,
          });
          void this.router.navigateByUrl(`/teams/${response.id}/admin/members`);
        }),
        catchError((err: unknown) => UtilService.getUnprocessableEntityErrors(err, this.teamForm)),
      ),
      { defaultValue: undefined },
    );
  }
}
