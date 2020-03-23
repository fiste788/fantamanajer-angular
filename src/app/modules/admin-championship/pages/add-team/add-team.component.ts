import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { TeamService } from '@app/http';
import { UtilService } from '@app/services';
import { Championship, Team, User } from '@shared/models';

@Component({
  selector: 'fm-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.scss']
})
export class AddTeamComponent implements OnInit {
  @ViewChild(NgForm) teamForm: NgForm;

  team = new Team();

  constructor(
    private readonly teamService: TeamService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
    private readonly route: ActivatedRoute) { }

  ngOnInit(): void {
    const championship = UtilService.getSnapshotData<Championship>(this.route, 'championship');
    if (championship) {
      this.team.championship_id = championship.id;
      this.team.user = new User();
    }
  }

  save(): void {
    this.teamService.save(this.team)
      .subscribe(response => {
        this.team.id = response.id;
        this.snackBar.open('Modifiche salvate', undefined, {
          duration: 3000
        });
        void this.router.navigateByUrl(`/teams/${this.team.id}/admin/members`);
      },
        err => {
          UtilService.getUnprocessableEntityErrors(this.teamForm, err);
        }
      );
  }

}
