import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import type { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { map } from 'rxjs';
import type { Observable } from 'rxjs';

import { getRouteData } from '@app/functions';
import { save } from '@app/functions/save.function';
import type { AtLeast, RecursivePartial } from '@app/interfaces';
import type { Championship, Team } from '@data/interfaces';
import { TeamService } from '@data/services';

@Component({
  imports: [AsyncPipe, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSlideToggleModule],
  templateUrl: './add-team.page.html',
  styleUrl: './add-team.page.scss',
})
export class AddTeamPage {

  readonly #router = inject(Router);
  readonly #snackbar = inject(MatSnackBar);
  readonly #teamService = inject(TeamService);

  protected email = '';

  protected readonly team$ = this.loadData();

  protected loadData(): Observable<Partial<Team>> {
    return getRouteData<Championship>('championship').pipe(map(t => ({ championship_id: t.id })));
  }

  protected async save(team: RecursivePartial<Team>, teamForm: NgForm): Promise<boolean> {
    team.user = { email: this.email };
    const save$: Observable<AtLeast<Team, 'id'>> = team.id ? this.#teamService.updateTeam(team as AtLeast<Team, 'id'>) : this.#teamService.createTeam(team);

    return save(save$, false, this.#snackbar, {
      callback: async response => this.#router.navigateByUrl(`/teams/${response.id}/admin/members`),
      form: teamForm,
      message: 'Modifiche salvate',
    });
  }

}
