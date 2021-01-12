import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { TeamService } from '@data/services';
import { UtilService } from '@app/services';
import { Championship, Team, User } from '@data/types';

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

  public save(): void {
    this.teamService.save(this.team).subscribe(
      (response) => {
        this.team.id = response.id;
        this.snackBar.open('Modifiche salvate', undefined, {
          duration: 3000,
        });
        void this.router.navigateByUrl(`/teams/${this.team.id}/admin/members`);
      },
      (err) => {
        UtilService.getUnprocessableEntityErrors(this.teamForm, err);
      },
    );
  }
}
