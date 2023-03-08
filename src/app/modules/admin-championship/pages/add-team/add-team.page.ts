import { NgIf, AsyncPipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';

import { getRouteData } from '@app/functions';
import { save } from '@app/functions/save.function';
import { AtLeast, RecursivePartial } from '@app/types';
import { TeamService } from '@data/services';
import { Championship, Team } from '@data/types';

@Component({
  styleUrls: ['./add-team.page.scss'],
  templateUrl: './add-team.page.html',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatButtonModule,
    AsyncPipe,
  ],
})
export class AddTeamPage {
  @ViewChild(NgForm) protected teamForm?: NgForm;

  protected readonly team$: Observable<Partial<Team>>;
  protected email = '';

  constructor(
    private readonly teamService: TeamService,
    private readonly router: Router,
    private readonly snackbar: MatSnackBar,
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

    return save(save$, false, this.snackbar, {
      message: 'Modifiche salvate',
      form: this.teamForm,
      callback: async (response) =>
        this.router.navigateByUrl(`/teams/${response.id}/admin/members`),
    });
  }
}
