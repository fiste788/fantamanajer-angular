import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { TeamService } from '@data/services';
import { UtilService } from '@app/services';
import { Championship, Team, User } from '@data/types';
import { catchError, firstValueFrom, map, of } from 'rxjs';

@Component({
  styleUrls: ['./add-team.page.scss'],
  templateUrl: './add-team.page.html',
})
export class AddTeamPage implements OnInit {
  @ViewChild(NgForm) public teamForm: NgForm;

  public team = new Team();

  constructor(
    private readonly teamService: TeamService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  public ngOnInit(): void {
    const championship = UtilService.getSnapshotData<Championship>(this.route, 'championship');
    if (championship) {
      this.team.championship_id = championship.id;
      this.team.user = new User();
    }
  }

  public async save(): Promise<void> {
    return firstValueFrom(
      this.teamService.save(this.team).pipe(
        map((response) => {
          this.team.id = response.id;
          this.snackBar.open('Modifiche salvate', undefined, {
            duration: 3000,
          });
          void this.router.navigateByUrl(`/teams/${this.team.id}/admin/members`);
        }),
        catchError((err: unknown) => {
          UtilService.getUnprocessableEntityErrors(this.teamForm, err);
          return of();
        }),
      ),
    );
  }
}
